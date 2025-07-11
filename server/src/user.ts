import { Hono } from "hono"
import * as z from "zod/v4"

const User = z.object({
    id: z.number(),
    username: z.string(),
    email: z.email(),
    password: z.string()
});

export type User = z.infer<typeof User>;
let users: User[] = []

const app = new Hono()

function addNewUser(new_user: User) {
    const existing_user = users.find(user => user.email === new_user.email)
    if (existing_user) {
        return existing_user
    }
    users.push(new_user)
    
}


app.post("/", (c) => {
    let new_user: User = User.parse(c.req.json())

    return c.json("created user", 201);
});
