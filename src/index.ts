import { Elysia, t } from 'elysia'
import { cookie } from '@elysiajs/cookie'
import { swagger } from '@elysiajs/swagger'

import { auth, post } from './modules'

const app = new Elysia()
    .use(
        swagger({
            documentation: {
                info: {
                    title: 'Elysia Supabase Authentication',
                    version: '0.3.0-rc'
                },
                tags: [
                    {
                        name: 'Authorized',
                        description:
                            "Need a 'access_token' and 'refresh_token' cookie for authorization"
                    },
                    {
                        name: 'Authentication',
                        description: 'For user authentication'
                    }
                ]
            }
        })
    )
    .use(auth)
    .use(post)
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
