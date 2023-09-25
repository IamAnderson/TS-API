import express, { Request, Response }  from "express";
import { UserModel, createUser, getUserByEmail } from "../db/users";
import { authentication, random } from "../helpers";


export const login = async(req: Request, res:Response) => {
    try {
        const { email, password } = req.body;

        const user = await getUserByEmail(email).select("authentication.salt +authentication.password");
        if(!user) return res.sendStatus(400);

        const expectedHash = authentication(user.authentication.salt, password)
        //@ts-ignore
        if(user.authentication.password != expectedHash) return res.sendStatus(403);


        const salt = random();
        //@ts-ignore
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie("TS_API-AUTH", user.authentication.sessionToken, { domain: "localhost", path: "/" })

        return res.status(200).json(user).end();

    }catch (error) {
        res.status(400).json({errorFromAuthController: error })
    }
}


export const register = async(req: Request, res:Response) => {
    try {
        const { email, password, username } = req.body;

        if(!email || !password || !username) return res.status(400).json({ message: "Add the needed credentials" });


        //check if user exists
        const existingUser = await getUserByEmail(email)
        if(existingUser) return res.sendStatus(400);

        const salt = random();
        const user = await createUser({ email, username, authentication: { salt, password: authentication(salt, password) } });

        return res.status(200).json(user).end();

    } catch (error) {
        res.status(400).json({errorFromAuthController: error })
    }
}
