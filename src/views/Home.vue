<template>
    <my-page title="接口文档" :page="page">
        <div class="left-box">
            <div class="nav-box">
                <div class="search-box">
                    <input class="input" v-model="keyword" placeholder="搜索">
                    <ui-icon-button icon="close" @click="keyword = ''" v-if="keyword" />
                </div>
                <div class="my-tree-box">
                    <v-tree ref='tree'
                            :data='treeData'
                            @node-click="click"
                            :halfcheck='true'/>
                </div>
            </div>
        </div>
        <div class="right-box">
            <ui-article id="info" class="article" v-if="info && !keyword">
                <h1>{{ info.name }}</h1>
                <div v-html="html(info.description)"></div>
            </ui-article>
            <div class="empty-box" v-if="keyword && !filtedRequests.length">
                <div>没有搜索结果</div>
            </div>
            <ul class="request-list">
                <li :id="request.id" class="request-item" v-for="request, index in filtedRequests">
                    <h2 class="title">
                        <span class="method"
                              @click="showTool(request)"
                              :class="['method-' + request.request.method]"
                              title="请求">{{ request.request.method }}</span>
                        {{ request.name }}
                    </h2>
                    <div class="url btn-copy" :data-clipboard-text="getUrl(request)" title="点击复制 URL">{{ getUrl(request) }}</div>
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
                    <!--<div>-->
                        <!--<h2 class="sub-title">HEADERS</h2>-->
                        <!--<table>-->
                            <!--<tr v-for="header in request.request.header">-->
                                <!--<th>{{ header.key }}</th>-->
                                <!--<td>{{ header.value }}</td>-->
                                <!--<td>{{ header.description }}</td>-->
                            <!--</tr>-->
                        <!--</table>-->
                    <!--</div>-->
                </li>
            </ul>
        </div>
        <ui-drawer class="tool-box" right :open="toolVisible" @close="toggle()">
            <ui-appbar title="工具">
                <ui-icon-button icon="close" @click="toggle" slot="left" />
            </ui-appbar>
            <div class="body" v-if="curRequest">
                <div class="url">{{ getUrl(curRequest) }}</div>
                <ui-raised-button primary label="HTTP 请求" @click="doRequest" />

                <div v-if="!response">
                    <div>点击“请求”按钮进行请求</div>
                </div>
                <div class="" v-if="response">
                    <div>Status: {{ response.status }} {{ response.statusText }}</div>
                    <h2 class="sub-title">响应 / Responses</h2>
                    <ui-tabs class="my-tab" :value="activeTab" @change="handleTabChange">
                        <ui-tab value="tab1" title="Body"/>
                        <ui-tab value="tab2" title="Headers"/>
                        <ui-tab value="tab3" title="Test"/>
                    </ui-tabs>
                    <div v-if="activeTab === 'tab1'">
                        <pre>
                            {{ response.data }}
                        </pre>
                    </div>
                    <div v-if="activeTab === 'tab2'">
                        {{ response.headers.list }}
                        <table>
                            <tr>
                                <th>Key</th>
                                <th>Value</th>
                            </tr>
                            <tr v-for="header in response.headers">
                                <th :title="getResponseHeaderDesc(header.key)">{{ header.key }}</th>
                                <td>{{ header.value }}</td>
                            </tr>
                        </table>
                    </div>
                    <div v-if="activeTab === 'tab3'">
                        <div>测试用例</div>
                    </div>
                </div>
            </div>
        </ui-drawer>
        <ui-drawer class="tool-box" right :open="toolVisible" @close="toggle()">
            <ui-appbar title="工具">
                <ui-icon-button icon="close" @click="toggle" slot="left" />
            </ui-appbar>
            <div class="body" v-if="curRequest">
                <div class="url">{{ getUrl(curRequest) }}</div>
                <ui-raised-button primary label="HTTP 请求" @click="doRequest" />

                <div v-if="!response">
                    <div>点击“请求”按钮进行请求</div>
                </div>
                <div class="" v-if="response">
                    <div>Status: {{ response.status }} {{ response.statusText }}</div>
                    <h2 class="sub-title">响应 / Responses</h2>
                    <ui-tabs class="my-tab" :value="activeTab" @change="handleTabChange">
                        <ui-tab value="tab1" title="Body"/>
                        <ui-tab value="tab2" title="Headers"/>
                        <ui-tab value="tab3" title="Test"/>
                    </ui-tabs>
                    <div v-if="activeTab === 'tab1'">
                        <pre>
                            {{ response.data }}
                        </pre>
                    </div>
                    <div v-if="activeTab === 'tab2'">
                        {{ response.headers.list }}
                        <table>
                            <tr>
                                <th>Key</th>
                                <th>Value</th>
                            </tr>
                            <tr v-for="header in response.headers">
                                <th :title="getResponseHeaderDesc(header.key)">{{ header.key }}</th>
                                <td>{{ header.value }}</td>
                            </tr>
                        </table>
                    </div>
                    <div v-if="activeTab === 'tab3'">
                        <div>测试用例</div>
                    </div>
                </div>
            </div>
        </ui-drawer>
        <ui-drawer class="tool-box" right :open="navVisible" :docked="false" @close="toggleNav()">
            <ui-appbar title="导航">
                <ui-icon-button icon="close" @click="toggleNav" slot="left" />
            </ui-appbar>
            <div class="body">
                <div class="nav-box">
                    <div class="search-box">
                        <input class="input" v-model="keyword" placeholder="搜索">
                        <ui-icon-button icon="close" @click="keyword = ''" v-if="keyword" />
                    </div>
                    <div class="my-tree-box">
                        <v-tree ref='tree'
                                :data='treeData'
                                @node-click="click"
                                :halfcheck='true'/>
                    </div>
                </div>
            </div>
        </ui-drawer>
    </my-page>
</template>

<script>
    const ClipboardJS = window.ClipboardJS
    const marked = window.marked
    
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
                    ]
                },
                menu: [
//                        {
//                            type: 'icon',
//                            icon: 'help',
//                            to: '/help'
//                        },
                    {
                        type: 'icon',
                        icon: 'settings',
                        click: this.toggleSetting,
                        title: '设置'
                    }
                ],
                data: null,
                info: null,
                requests: [],
                curRequest: null,
                keyword: '',
                toolVisible: false,
                navVisible: false,
                activeTab: 'tab1',
                response: null,
                settingVisible: false
            }
        },
        computed: {
            filtedRequests() {
                if (!this.keyword) {
                    return this.requests
                }
                let result = []
                for (let request of this.requests) {
                    let url = this.getUrl(request)
                    if (request.name.includes(this.keyword) || url.includes(this.keyword)) {
                        result.push(request)
                    }
                }
                return result
            }
        },
        mounted() {
            this.init()
        },
        destroyed() {
            this.clipboard.destroy()
            window.removeEventListener('resize', this.onResize)
        },
        methods: {
            toggleNav() {
                this.navVisible = !this.navVisible
            },
            toggleSetting() {
                this.settingVisible = !this.settingVisible
            },
            handleTabChange(val) {
                this.activeTab = val
            },
            getUrl(request) {
                return this.getTemplateStr(request.request.url.raw || request.request.url)
            },
            showTool(request) {
                this.response = null
                this.toolVisible = true
                this.curRequest = request
            },
            toggle () {
                this.toolVisible = !this.toolVisible
            },
            html(markdown) {
                return marked(markdown)
            },
            getTemplateStr(request) {
                let baseUrl = 'http://192.168.3.60:9998/index.php/home'
//                let baseUrl = 'http://localhost:9998/index.php/home'
                return request.replace('{{baseurl}}', baseUrl)
            },
            click(node) {
//                console.log(node)
                if (node.info) {
                    location.href = '#info'
                    this.navVisible = false
                } else if (node.isLeave) {
                    this.navVisible = false
                    location.href = '#' + node.toId
                } else {
                    node.expanded = !node.expanded
                }
            },
            init() {
                let url = 'http://localhost:9999/wsdgy/api/erp.postman_collection.json'
                url = url + '?time=' + new Date().getTime()
                this.$http.get(url).then(
                    response => {
                        let data = response.data
                        this.data = data
                        console.log(data.info)
                        this.info = data.info
                        this.dealData(data)
                        // hash
                        if (location.hash) {
                            location.href = location.hash
                        }
                    },
                    response => {
                        console.log(response)
                    })
                this.clipboard = new ClipboardJS('.btn-copy')
                this.clipboard.on('success', function (e) {
//                    console.info('Action:', e.action);
//                    console.info('Text:', e.text);
//                    console.info('Trigger:', e.trigger);
                    e.clearSelection()
                })
                this.clipboard.on('error', function (e) {
                    console.error('Action:', e.action)
                    console.error('Trigger:', e.trigger)
                })
                window.addEventListener('resize', this.onResize = () => {
                    this.resize()
                }, false)
                this.resize()
            },
            resize() {
                if (window.innerWidth < 800) {
                    this.page.menu = this.menu.concat([
                        {
                            type: 'icon',
                            icon: 'list',
                            click: this.toggleNav,
                            title: '目录'
                        }
                    ])
                } else {
                    this.page.menu = this.menu
                }
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
                arr.push({
                    title: '介绍',
                    info: true,
                    isLeave: true,
                    children: []
                })
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
            doRequest() {
                console.log('请求')
                console.log(this.curRequest.request.method)
                this.$http({
                    method: this.curRequest.request.method,
                    url: this.getUrl(this.curRequest),
//                    data: {
//                        firstName: 'Fred',
//                        lastName: 'Flintstone'
//                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    response => {
                        console.log(response)
                        this.response = this.parseResponse(response)
                    },
                    (response, b, c) => {
                        console.log(response, b, c)
                        this.response = this.parseResponse(response)
                    })
                    .catch(function (error, b) {
                        console.log(error, b)
                    })
            },
            parseResponse(response) {
                let headers = []
                for (let key in response.headers) {
                    headers.push({
                        key: key,
                        value: response.headers[key]
                    })
                }
                response.headers = headers
                return response
            },
            getResponseHeaderDesc(name) {
                switch (name) {
                    case 'expires':
                        return '过期时间'
                    default:
                        return ''
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../scss/doc";
</style>
