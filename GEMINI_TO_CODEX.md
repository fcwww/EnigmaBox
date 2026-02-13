Role: Senior Frontend Engineer (Electron + Vue Specialist)
Task: 开发名为 "EnigmaBox" 的 Puzzle Hunt 工具箱。

核心技术栈:

    框架: Electron + Vue 3 (Vite) + TypeScript.

    UI: Tailwind CSS. 要求：赛博极简主义（深色模式、毛玻璃效果、呼吸灯动态色）。

    语言: 全中文 UI 界面。

一级功能模块 (Main Navigation):

    A1Z26 工具: 包含 10进制、2进制(5位)、3进制(3位)、以及“四位康拓展开”转 A1Z26 的功能。

    凯撒密码: 输入字符串，一次性展示全部 25 种位移结果，并清晰标注“位移量”。

    摩斯电码: 支持点(.)、划(-)的交互式编解码。

    盲文解码: 提供 2x3 的交互式点阵按钮，点击切换开关状态，实时显示对应字符。

    旗语解码: 提供 8 方位圆形布局按钮，用户依次选择两个方位，实时显示对应字符。

    猪圈密码: 采用图形化九宫格/X格选择器，点击对应图形块进行输入解码。

架构要求:

    在 src/modules/ 目录下为每种密码建立独立文件夹。

    定义统一的 CipherProvider 接口，确保未来能像“插拔插件”一样添加新功能。

    提供 README.md (中文) 和 DEVELOPMENT.md (中文) 文档。
