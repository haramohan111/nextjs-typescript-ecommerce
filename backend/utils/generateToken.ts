// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
import { sign } from 'jsonwebtoken';

export function generateAccessToken(id: string): string {
    const token = sign({ id }, process.env.ACCESS_TOKEN_SECRET as string, {
        algorithm: 'HS256',
        expiresIn: '60s'
    });
    return token;
}

export function generateRefreshToken(id: string): string {
    const token = sign({ id }, process.env.REFRESH_TOKEN_SECRET as string, {
        algorithm: 'HS256',
        expiresIn: '5d'
    });
    return token;
}

export function generateVerifyAdminToken(id: string): string {
    const token = sign({ id }, process.env.ADMIN_TOKEN_SECRET as string, {
        algorithm: 'HS256',
        expiresIn: '1h'
    });
    return token;
}

export function generateVerifyUserToken(id: string): string {
    const token = sign({ id }, process.env.USER_TOKEN_SECRET as string, {
        algorithm: 'HS256',
        expiresIn: '1h'
    });
    return token;
}


//export default generateToken