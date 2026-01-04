import { requireAuth, clerkClient, getAuth } from "@clerk/express";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const { userId: clerkId } = getAuth(req);

      if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

        // find user in db by clerk ID
        let user = await User.findOne({ clerkId });

        if (!user) {
          console.log(`JIT: User ${clerkId} not found in DB by clerkId, attempting to provision from Clerk...`);
          try {
            const clerkUser = await clerkClient.users.getUser(clerkId);
            const email = clerkUser.emailAddresses[0]?.emailAddress;
            console.log(`JIT: Successfully fetched user ${clerkId} from Clerk:`, email);

            // Try to find user by email first (in case they existed but clerkId was different/missing)
            user = await User.findOne({ email });

            if (user) {
              console.log(`JIT: User found by email ${email}, updating clerkId to ${clerkId}`);
              user.clerkId = clerkId;
              user.name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || user.name;
              user.profileImage = clerkUser.imageUrl || user.profileImage;
              await user.save();
            } else {
              console.log(`JIT: User not found by email, creating new user for ${email}`);
              user = await User.create({
                clerkId: clerkUser.id,
                email,
                name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
                profileImage: clerkUser.imageUrl,
              });
            }

            // Sync with Stream as well
            await upsertStreamUser({
              id: user.clerkId,
              name: user.name,
              image: user.profileImage,
            });

            console.log(`JIT: Processed user ${user.email} successfully`);
          } catch (clerkError) {
            console.error("Error fetching user from Clerk or creating in DB:", clerkError.message || clerkError);
            return res.status(404).json({ message: "User not found and could not be provisioned" });
          }
        }

      // attach user to req
      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
