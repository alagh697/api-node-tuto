import Thing from "./thing"
import User from "./user"

interface Like{
    id: number
    user: User
    thing: Thing
    created_at: string
}

export default Like