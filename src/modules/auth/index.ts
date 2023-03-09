import { Elysia, t } from 'elysia'
import { cookie } from '@elysiajs/cookie'

import { supabase } from '../../libs'

export const auth = (app: Elysia) =>
    app
        .use(
            cookie({
                httpOnly: true
                // If you need cookie to deliver via https only
                // secure: true,
                //
                // If you need a cookie to be available for same-site only
                // sameSite: "strict",
                //
                // If you want to encrypt a cookie
                // signed: true,
                // secret: process.env.COOKIE_SECRET,
            })
        )
        .group('/auth', (app) =>
            app
                .setModel({
                    sign: t.Object({
                        email: t.String(),
                        password: t.String({
                            minLength: 8
                        })
                    })
                })
                .post(
                    '/sign-up',
                    async ({ body }) => {
                        const { data, error } = await supabase.auth.signUp(body)

                        if (error) return error
                        return data.user
                    },
                    {
                        schema: {
                            body: 'sign',
                            detail: {
                                description: 'Sign up a new user',
                                tags: ['Authentication']
                            }
                        }
                    }
                )
                .post(
                    '/sign-in',
                    async ({ body, setCookie }) => {
                        const { data, error } =
                            await supabase.auth.signInWithPassword(body)

                        if (error) return error

                        setCookie('refresh_token', data.session!.refresh_token)
                        setCookie('access_token', data.session!.access_token)

                        return data.user
                    },
                    {
                        schema: {
                            body: 'sign',
                            detail: {
                                description: 'Sign in a user',
                                tags: ['Authentication']
                            }
                        }
                    }
                )
                .get(
                    '/refresh',
                    async ({ setCookie, cookie: { refresh_token } }) => {
                        const { data, error } =
                            await supabase.auth.refreshSession({
                                refresh_token
                            })

                        if (error) return error

                        setCookie('refresh_token', data.session!.refresh_token)

                        return data.user
                    },
                    {
                        schema: {
                            detail: {
                                description: 'Renew access_token',
                                tags: ['Authentication', 'Authorized']
                            }
                        }
                    }
                )
        )
