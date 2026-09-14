import { z } from "zod";


const mentionSchema = z.object({
  username: z
    .string()
    .min(1)
    .max(30)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Invalid username format"
    ),
});


export function extractMentions(content) {
  const mentionRegex = /@([a-zA-Z0-9_]+)/g;

  const usernames = [
    ...content.matchAll(mentionRegex),
  ].map((match) => match[1]);

  // Remove duplicates
  const uniqueUsernames = [...new Set(usernames)];

  // Validate usernames
  return uniqueUsernames.filter((username) => {
    return mentionSchema.safeParse({ username }).success;
  });
}
