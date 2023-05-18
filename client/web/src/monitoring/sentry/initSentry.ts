// Import only types to avoid adding `@sentry/browser` to our bundle.
import type { Hub, init, onLoad } from '@sentry/browser'
import * as Sentry from '@sentry/browser'

import { authenticatedUser } from '../../auth'
import { shouldErrorBeReported } from '../shouldErrorBeReported'

export type SentrySDK = Hub & {
    init: typeof init
    onLoad: typeof onLoad
}

declare global {
    const Sentry: SentrySDK
}

//window.context.sentryDSN &&
//(process.env.NODE_ENV === 'production' || process.env.ENABLE_SENTRY)
export function initSentry(): void {
    if (
        typeof Sentry !== 'undefined'
    ) {
        const { sentryDSN, version } = window.context

        // Wait for Sentry to lazy-load from the script tag defined in the `app.html`.
        // https://sentry-docs-git-patch-1.sentry.dev/platforms/javascript/guides/react/install/lazy-load-sentry/
        Sentry.onLoad(() => {
            Sentry.init({
                dsn: 'https://8c733c3f33cb403389efd598537c44f3@o4505167711109120.ingest.sentry.io/4505195962040320',
                // TODO frontend platform team, follow-up to https://github.com/sourcegraph/sourcegraph/pull/38411
                // tunnel: '/-/debug/sentry_tunnel',
                release: 'frontend@' + version,
                beforeSend(event, hint) {
                    event.tags = event.tags || {}
                    event.tags['disto-project-id'] = 'my-project-id'
                    // Use `originalException` to check if we want to ignore the error.
                    //if (!hint || shouldErrorBeReported(hint.originalException)) {
                    //    return event
                    //}

                    return event //null
                },
            })

            // Sentry is never un-initialized.
            // eslint-disable-next-line rxjs/no-ignored-subscription
            authenticatedUser.subscribe(user => {
                Sentry.configureScope(scope => {
                    if (user) {
                        scope.setUser({ id: user.id })
                    }
                })
            })
        })
    }
}
