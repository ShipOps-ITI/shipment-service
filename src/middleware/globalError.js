import { Prisma } from "@prisma/client";

export const globalError = (err, req, res, next) => {

    // Prisma unique constraint
    if (err instanceof Prisma.PrismaClientKnownRequestError) {

        switch (err.code) {

            case "P2002":
                err.message = "A record with this value already exists.";
                err.statusCode = 409;
                break;

            case "P2025":
                err.message = "Record not found.";
                err.statusCode = 404;
                break;

            default:
                err.statusCode = 500;
        }
    }

    res.status(err.statusCode || 500).json({

        success: false,

        message: err.message || "Internal Server Error"

    });

};