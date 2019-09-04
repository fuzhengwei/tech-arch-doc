module.exports = {
    port: "3000",
    dest: "docs",
    ga: "UA-85414008-1",
    base: "/",
    markdown: {
        lineNumbers: true,
        externalLinks: {
            target: '_blank', rel: 'noopener noreferrer'
        }
    },
    locales: {
        "/": {
            lang: "zh-CN",
            title: "Java 全栈知识体系",
            description: "Java 全栈知识体系"
        }
    },
    head: [["link", {rel: "icon", href: `/favicon.ico`}]],
    themeConfig: {
        repo: "realpdai/tech-arch-doc",
        docsRepo: "realpdai/tech-arch-doc",
        editLinks: true,
        sidebarDepth:0,
        locales: {
            "/": {
                label: "简体中文",
                selectText: "Languages",
                editLinkText: "在 GitHub 上编辑此页",
                lastUpdated: "上次更新",
                nav: [
                    {
                        text: 'Spring 相关',
                        items: [
                            {text: 'Spring 基础', link: '/md/spring/spring.md'},
                            {text: 'Spring Boot 入门', link: '/md/spring/springboot-helloworld.md'},
                            {text: 'Spring Boot 进阶', link: '/md/spring/springboot-data-multi.md'}
                        ]
                    }
                    // , {text: "Spring 相关", link: "/md/spring/" }
                ],
                sidebar: {
                    "/md/spring/": genSidebar4Spring()
                }
            }
        }
    },
    plugins: [
        ['@vuepress/back-to-top', true]
    ]
};

function genSidebar4Spring() {
    return [
        {
            title: "Spring 基础",
            collapsable: false,
            sidebarDepth: 0, 
            children: [
                "spring", 
                "springmvc",
                "spring-bean-lifecycle",
                "spring-aop",
            ]
        },
        {
            title: "Spring Boot 入门",
            collapsable: false,
            children: [
                "springboot-helloworld",
                "springboot-data-swagger",
                "springboot-data-logback",
                "springboot-data-mybatis",
                "springboot-data-mongodb",
                "springboot-data-es",
                "springboot-data-websocket",
                "springboot-data-interface",
                "springboot-data-ratelimit",
                "springboot-data-quartz",
            ]
        },
        {
            title: "Spring Boot 进阶",
            collapsable: false,
            children: [
                "springboot-data-multi",
                "springboot-javaConfig",
                "springboot-jar-3rd",
                "springboot-starter-demo",
                "springboot-javafx-native"
            ]
        }
    ]
}
