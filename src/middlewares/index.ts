import express, { NextFunction, Request, Response } from "express";
import { getUserById, getUserBySessionToken } from "../db/users";
import { get, merge } from "lodash";


export const isOwner = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const currentUserId = get(req, "identity._id") as string

        if(!currentUserId) return res.status(403).json({ message: "No User" });

        if(currentUserId.toString() !== id) return res.sendStatus(403);

        return next();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};


export const isAuthenticated = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionToken = req.cookies["TS_API-AUTH"];

        if(!sessionToken) return res.sendStatus(403);

        const existingUser = await getUserBySessionToken(sessionToken);
        if(!existingUser) return res.sendStatus(403);

        merge(req, { identity: existingUser });

        return next();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
