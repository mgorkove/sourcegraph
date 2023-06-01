import * as sentry from '@sentry/browser'

import { authenticatedUser } from './auth'
console.log("outside init sentry");
if (true) {
    console.log("init sentry");
    sentry.init({
        dsn: 'https://2a3f43ccf07646e1ab09968991957cd7@o4505245098770432.ingest.sentry.io/4505245124591616',
        release: 'frontend@' + window.context.version,
    })
    // Sentry is never un-initialized
    // eslint-disable-next-line rxjs/no-ignored-subscription
    authenticatedUser.subscribe(user => {
        sentry.configureScope(scope => {
            if (user) {
                scope.setUser({ id: user.id })
            }
        })
    })
}
