module.exports = {
	
	"locals": {},
	
	"languages": {
		"en": {
			"primarynav": [
				{ "section": "home",                "path": "/",                      "label": "Home" },
				{ "section": "starting",            "path": "/getting-started",       "label": "Getting Started" },
				{ "section": "docs",                "path": "/docs",                  "label": "Documentation" },
				{ "section": "examples",            "path": "/examples",              "label": "Examples" }
			],
			"docsnav": [
				{ "value": "getting-started",       "path": "/docs/getting-started",  "label": "Getting Started",  "labelsm": "Starting" },
				{ "value": "configuration",         "path": "/docs/configuration",    "label": "Configuration",    "labelsm": "Config" },
				{ "value": "database",              "path": "/docs/database",         "label": "Database",         "labelsm": "Data" }
			]
		},
		"zh": {
			"primarynav": [
				{ "section": "home",                "path": "/zh",                       "label": "首页" },
				{ "section": "starting",            "path": "/zh/getting-started",       "label": "入门指南" },
				{ "section": "docs",                "path": "/zh/docs",                  "label": "文档" },
				{ "section": "examples",            "path": "/zh/examples",              "label": "范例" }
			],
			"docsnav": [
				{ "value": "getting-started",       "path": "/zh/docs/getting-started",  "label": "入门指南",         "labelsm": "入门" },
				{ "value": "configuration",         "path": "/zh/docs/configuration",    "label": "配置",             "labelsm": "配置" },
				{ "value": "database",              "path": "/zh/docs/database",         "label": "数据库",           "labelsm": "数据库" }
			]
		}
	},
	
	"routes": [
		
		// Language: en
		{
			"path": "/",
			"language": "en",
			"template": "pages/home",
			"section": "home",
			"title": "Node.js cms and web application platform built on Express and MongoDB"
		},
		{
			"path": "/getting-started",
			"language": "en",
			"template": "pages/starting",
			"section": "starting",
			"title": "Getting started"
		},
		{
			"path": "/examples",
			"language": "en",
			"template": "pages/examples",
			"section": "examples",
			"title": "Sample applications"
		},
		{
			"path": "/docs",
			"language": "en",
			"template": "pages/docs/index",
			"section": "docs",
			"docssection": { "value": "introduction", "path": "/docs", "label": "Introduction" },
			"title": "KeystoneJS Documentation"
		},
		{
			"path": "/docs/getting-started",
			"language": "en",
			"template": "pages/docs/getting-started",
			"section": "docs",
			"docssection": { "value": "getting-started", "path": "/docs/guides", "label": "Guides" },
			"title": "Getting Started"
		},
		{
			"path": "/docs/configuration",
			"language": "en",
			"template": "pages/docs/configuration",
			"section": "docs",
			"docssection": { "value": "configuration", "path": "/docs/configuration", "label": "Configuration" },
			"title": "Configuration"
		},
		{
			"path": "/docs/database",
			"language": "en",
			"template": "pages/docs/database",
			"section": "docs",
			"docssection": { "value": "database", "path": "/docs/database", "label": "Database" },
			"title": "Setting up and using Data Models"
		},
		/* {
			"path": "/docs/views",
			"template": "docs/views",
			"section": "docs",
			"docssection": { "value": "views", "path": "/docs/views", "label": "Views" },
			"title": "Using Views in your application"
		},*/
		
		// Language: zh
		{
			"path": "/zh",
			"language": "zh",
			"template": "zh/pages/home",
			"section": "home",
			"title": "基于Express和MongoDB搭建的Node.js cms和web应用程序平台"
		},
		{
			"path": "/zh/getting-started",
			"language": "zh",
			"template": "zh/pages/starting",
			"section": "starting",
			"title": "入门"
		},
		{
			"path": "/zh/examples",
			"language": "zh",
			"template": "zh/pages/examples",
			"section": "examples",
			"title": "范例程序"
		},
		{
			"path": "/zh/docs",
			"language": "zh",
			"template": "zh/pages/docs/index",
			"section": "docs",
			"docssection": { "value": "introduction", "path": "/zh/docs", "label": "Introduction" },
			"title": "KeystoneJS文档"
		},
		{
			"path": "/zh/docs/getting-started",
			"language": "zh",
			"template": "zh/pages/docs/getting-started",
			"section": "docs",
			"docssection": { "value": "getting-started", "path": "/zh/docs/guides", "label": "Guides" },
			"title": "入门"
		},
		{
			"path": "/zh/docs/configuration",
			"language": "zh",
			"template": "zh/pages/docs/configuration",
			"section": "docs",
			"docssection": { "value": "configuration", "path": "/zh/docs/configuration", "label": "Configuration" },
			"title": "配置"
		},
		{
			"path": "/zh/docs/database",
			"language": "zh",
			"template": "zh/pages/docs/database",
			"section": "docs",
			"docssection": { "value": "database", "path": "/zh/docs/database", "label": "Database" },
			"title": "设置和使用数据模型"
		}
	]
}
