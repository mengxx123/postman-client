<template>
    <my-page title="接口文档">
        <div class="left-box">
            <v-tree ref='tree'
                    :data='treeData'
                    @node-click="click"
                    :halfcheck='true'/>
        </div>
        <div class="right-box">
            <ui-article class="article" v-if="info">
                <h1>{{ info.name }}</h1>
            </ui-article>
            <ul class="request-list">
                <li :id="request.id" class="request-item" v-for="request, index in requests">
                    <h2 class="title">
                        <span class="method" :class="['method-' + request.request.method]" :title="'' + index">{{ request.request.method }}</span>
                        {{ request.name }}
                    </h2>
                    <div class="url">{{ getTemplateStr(request.request.url.raw || request.request.url) }}</div>
                    <div v-if="request.request.body.raw">
                        <h2 class="sub-title">BODY</h2>
                        <pre v-if="request.request.body.raw">{{ request.request.body.raw }}</pre>
                    </div>
                    <div v-if="request.request.header.length">
                        <h2 class="sub-title">HEADERS</h2>
                        <table>
                            <tr v-for="header in request.request.header">
                                <th>{{ header.key }}</th>
                                <td>{{ header.value }}</td>
                                <td>{{ header.description }}</td>
                            </tr>
                        </table>
                    </div>
                </li>
            </ul>
        </div>
        <!--<div v-if="data">-->
            <!--{{ data.info }}-->
            <!--<br>-->
            <!--<ul>-->
                <!--<li v-for="it in data.item">-->
                    <!--21212-->
                <!--</li>-->
            <!--</ul>-->
        <!--</div>-->
    </my-page>
</template>

<script>
    export default {
        data () {
            return {
                treeData: [
                    {
                        title: '一级节点',
                        expanded: true
                    }
                ],
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'help',
                            to: '/help'
                        }
                    ]
                },
                data: null,
                info: null,
                requests: [],
                curRequest: null
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            getTemplateStr(request) {
                return request.replace('{{baseurl}}', 'http://192.168.3.60:9998/index.php/home')
            },
            click(node) {
//                console.log(node)
                if (node.isLeave) {
                    location.href = '#' + node.toId
                } else {
                    node.expanded = !node.expanded
                }
            },
            init() {
                let url = 'http://localhost:8082/static/swagger.json'
                url = url + '?time=' + new Date().getTime()
                this.$http.get(url).then(
                    response => {
                        let data = response.data
                        this.data = data
                        console.log(data)
                        this.info = data.info
                        this.dealData(data)
                    },
                    response => {
                        console.log(response)
                    })
            },
            dealData(data) {
                this.requests = []
                this.treeData = this.getTreeFromData(data)
                console.log(this.requests[2])
            },
            getItem(item) {
                if (item.item) {
                    let node = {
                        title: item.name,
                        nocheck: true,
                        children: []
                    }
                    for (let it of item.item) {
                        node.children.push(this.getItem(it))
                    }
                    return node
                } else {
                    let id = this.getId()
                    item.id = id
                    this.requests.push(item)
                    return {
                        title: item.request.method + '   ' + item.name,
                        nocheck: true,
                        isLeave: true,
                        toId: id
                    }
                }
            },
            getTreeFromData(data) {
                let arr = []
                for (let it of data.item) {
                    arr.push(this.getItem(it))
                }
                return arr
            },
            getId() {
                if (!this._id) {
                    this._id = 1
                }
                return this._id++
            },
            tpl (node, ctx) {
//                let titleClass = node.selected ? 'node-title node-selected' : 'node-title'
//                if (node.searched) titleClass += ' node-searched'
                return `121211`
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../scss/doc";
</style>
