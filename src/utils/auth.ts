import { getToken } from "./user";


async function authWithToken(req, res) {
    const headerToken = req.get('Authorization')
    const token = await getToken(headerToken)

    if (!token) {
      res.status(403)
      throw new Error("Unauthorized, provide 'Authorization: <token>' header.")
    }

    return token.user;
}

export { authWithToken };