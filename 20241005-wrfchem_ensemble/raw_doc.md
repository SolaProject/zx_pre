```
title: "WRFChem Ensemble CO<sub>2</sub>"
author: "周旭"
institude: "中国科学院大气物理研究所"
short_title: null
short_author: null
short_institude: null
other_char1: "1234567890"
other_char2: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
other_char3: "!@#$%^&*()_+~`-=[]{};':\",./<>?\\|"
```

# WRFChem Ensemble CO<sub>2</sub>

## 模式介绍

### 目前 WRFChem 模式$\mathrm{CO}_2$方案

* 主要模式过程分为排放处理和大气传输两部分，并未考虑$\mathrm{CO}_2$的化学反应
* 计算得到的$\mathrm{CO}_2$不会影响大气物理化学性质，也不会影响传输过程
* 对于不同的排放/通量的处理过程是一致的（区别仅在于变量名）

![wrfchem_co2](./images/wrfchem_co2.png)

### 现有 WRFChem 模式的问题

1. **集合模拟需求：**
	* 运行多个集合，重复的气象过程计算导致了大量计算资源的浪费
	* 在集合计算中仅需要CO2_ANT一个变量，其他变量是不必要的
	* 对于多种不同情景，例如区分某个城市的增量，需要重复计算气象过程
2. **模式计算BUG：**
	* 在WRF-Chem开发者的认知中，目前模式中气体浓度为干空气摩尔分数
	* 模式传输计算中前后$\mathrm{CO}_2$基本守恒（也就是使用的干空气质量）
	* 模式通量计算中使用的空气质量为湿空气质量
	* 可能会导致通量计算的浓度增量存在约0.5%的误差（包括人为、自然）
	* 参考：<a href="https://forum.mmm.ucar.edu/threads/rho_phy-and-unit-of-tracers-into-wrf-atmosphere.9395/#:~:text=I'm%20using%20WRF%20to%20compute%20transport%20of%20passive%20greenhouse%20gas" target="_blank">rho_phy and unit of tracers into WRF atmosphere</a>

### WRFChem 集合$\mathrm{CO}_2$模拟方案

* 增加了10个参数化方案，可分别模拟10-100个集合$\mathrm{CO}_2$
* 增加了控制排放计算使用干湿空气的选项
* 这些方案中不计算VPRM以及其他自然碳通量，全部依赖输入通量清单

![wrfchem_en_co2](./images/wrfchem_en_co2.png)

## 模式修改

### WRF 模式修改与代码生成

1. **修改注册表（Registry），并自动生成相关代码**
   * 例如数组内存申请、输入输出等代码，在WRF中都是在注册表中写入，然后编译时自动生成相关代码
   * 一般来说修改注册表即可，关于注册表的说明见《WRF使用指南》第8章
2. **修改 Fortran \*.F 源代码，编译时生成 \*.F90**
   * 主要用于实现模式的主要逻辑，可以直接调用 namelist 选项和注册表中定义的变量

### 辅助工具——GitHub搜索

* **GitHub 支持限定词（限定仓库、语言、路径、内容等）、正则表达式与布尔运算符构建搜索请求**
* **优点**：搜索功能强大，搜索速度快，全部可以线上完成，不需要下载源代码，可以看到搜索结果上下文
* **缺点**：仅可检索源代码，无法检索编译过程中自动生成的内容

![github_search](./images/github_search.jpg)

### 辅助工具——Linux grep 命令

* `grep -inHr "<str>" <files>`：显示文件、行号，忽略大小写，遍历子目录
* **优点**：对本地文件进行检索，可以搜索编译后结果
* **缺点**：搜索速度较慢，无法看到搜索结果附近代码

![grep_search](./images/grep_search.jpg)

### 辅助工具——fprettify

* 格式化 Fortran 代码，用于应对编写格式混乱的问题
* 优点：修改后的代码可阅读性更强，安装简单，可以通过 pip 或 conda 安装
* 缺点：可能会有bug，另外不建议用格式化后的代码编译
* 参考：<a href="https://github.com/fortran-lang/fprettify" target="_blank">fprettify: auto-formatter for modern fortran source code</a>

![fprettify](./images/fprettify.jpg)

### 主要修改流程

1. 寻找现有的类似的参数化方案，检索相关的关键字（包括但不限于 namelist 选项、注册表变量以及相应值、子程序定义与调用、日志信息等），找出所有可能需要修改的文件和位置
2. 阅读包含需要修改的内容所在的子程序的逻辑，了解其用途，如果看不懂则可以往上找
3. 对于 WRFChem 的化学物种，一般只需要考虑初始化、默认边界条件设置、排放文件读取以及具体的化学过程，物理传输过程由 Chem 统一实现，不需要自行编写代码
4. 编译修改后的源代码，根据报错debug，一般来说出错不需要clean，直接重新编译即可
5. 运行新编译模式程序，检查输出结果是否符合预期

## 运行测试

### 测试方案设计

* **网格设定**
  * 网格大小：105×105×44
  * 网格距：9km
  * 模拟区域：中国东南福建省周边
* **运行设定**
  * 时间积分步长：36s
  * 运行时间：18h
  * 从重启文件开始运行
* **计算资源**
  * 大装置单节点64核心
* **对照 WRFChem $\mathrm{CO}_2$ 设置**：
  * 基本设置一致，关闭VPRM计算

### 运行效率评估

* 随着集合数目增加，运算耗时（包括IO和计算）线性增加
* 原始 WRFChem 的$\mathrm{CO}_2$耗时约为10集合成员时的0.8倍
* 化学时间积分步长选项（chemdt）不影响气象传输过程的积分步长

![time_compare](./images/time_compare.png)