import { TSGhostAdminAPI } from "@ts-ghost/admin-api";
import { makeDomainFunction } from "domain-functions";
import * as z from "zod";
import { env } from "~/env";

export const inputCreateMember = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
});

export const createMember = makeDomainFunction(inputCreateMember)(
  async ({ name, email }) => {
    const admin = new TSGhostAdminAPI(
      env.GHOST_URL,
      env.GHOST_ADMIN_API_KEY,
      "v5.0"
    );

    const searchUser = await admin.members
      .browse({ limit: 1, filter: `email:${email}` })
      .fetch();
    if (searchUser.success && searchUser.data.length > 0) {
      throw new Error("User already exists");
    }
    const user = await admin.members.add(
      { name, email },
      { send_email: false }
    );
    if (!user.success) {
      console.log(user.errors);
      throw new Error("User could not be created");
    }
    console.log(`User ${user.data.name} created`, user.data);
    return {
      user,
    };
  }
);
