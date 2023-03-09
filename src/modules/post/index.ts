import { Elysia, t } from 'elysia'
import { cookie } from '@elysiajs/cookie'

import { authen, supabase } from '../../libs'

export const post = (app: Elysia) =>
    app.group('/post', (app) =>
        app
            .get(
                '/:id',
                async ({ params: { id } }) => {
                    const { data, error } = await supabase
                        .from('post')
                        .select()
                        .eq('id', id)

                    if (error) return error

                    return {
                        success: !!data[0],
                        data: data[0] ?? null
                    }
                },
                {
                    schema: {
                        detail: {
                            description: "Retrieve user's post by id"
                        }
                    }
                }
            )
            // ? Required auth
            .use(authen)
            .put(
                '/create',
                async ({ userId, body }) => {
                    const { data, error } = await supabase
                        .from('post')
                        .insert({
                            user_id: userId,
                            ...body
                        })
                        .select('id')

                    if (error) throw error

                    return data[0]
                },
                {
                    schema: {
                        body: t.Object({
                            post: t.String()
                        }),
                        detail: {
                            tags: ['Authorized'],
                            description: "Create a user's post"
                        }
                    }
                }
            )
    )
