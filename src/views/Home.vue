<template>
    <my-page title="接口文档">
        这是首页内容
    </my-page>
</template>

<script>
    export default {
        data () {
            return {
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'help',
                            to: '/help'
                        }
                    ]
                }
            }
        }
    }
</script>

<style scoped>
</style>
