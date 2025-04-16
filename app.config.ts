export default defineAppConfig({
    ui: {
        carousel: {
            variants: {
                active: {
                    true: {
                        dot: 'bg-secondary'
                    },
                    false: {
                        dot: 'bg-transparent border border-zinc-300'
                    }
                }
            }
        }
    }
})