
export const cookieOptions={
    expires: new Date(Date.now()+5*24*60*60*1000),
    httpOnly:true
}

export const logOutCookieOptions={
    expires: new Date(Date.now()),
    httpOnly:true
}
