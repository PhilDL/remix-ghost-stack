import { TSGhostAdminAPI } from "@ts-ghost/admin-api";
import { makeDomainFunction } from "domain-functions";
import * as z from "zod";
import { env } from "~/env";

export const inputVerifyMember = z.object({
  email: z.string().email(),
});

export const verifyMember = makeDomainFunction(inputVerifyMember)(
  async ({ email }) => {
    const admin = new TSGhostAdminAPI(
      env.GHOST_URL,
      env.GHOST_ADMIN_API_KEY,
      "v5.0"
    );

    const searchUser = await admin.members
      .browse({ limit: 1, filter: `email:${email}` })
      .fetch();
    if (!searchUser.success || searchUser.data.length === 0) {
      throw new Error("User could not be found");
    }
    return {
      user: searchUser.data[0],
    };
  }
);
