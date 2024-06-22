import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";


export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("thinks").first();
  },
});



export const replaceIdea = mutation({
  args: {updatedCircles : v.any()},
  handler: async (ctx,args) => {

    const updateOne = args.updatedCircles;
    // console.log(updateOne)
    const last = await ctx.db.query('thinks').collect();

  

    await ctx.db.replace('jh77a0psfmhgjnc7ha943egf1d6vhvbr', {thinks:updateOne});

    return true;
  },
});

