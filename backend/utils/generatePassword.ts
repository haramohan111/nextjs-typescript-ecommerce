import bcrypt from 'bcryptjs';

export const createHashedPassword = async (plainPassword: string) => {
    const saltRounds = 10; // Number of salt rounds, adjust as needed
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
};

// Usage example
export const myPlainPassword = 'mySuperSecretPassword123';
createHashedPassword(myPlainPassword).then((hashedPassword) => {
    console.log('Hashed Password:', hashedPassword);
});
