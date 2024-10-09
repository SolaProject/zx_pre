// 在网页 head 中加入 css 引用
document.getElementsByTagName("head")[0].appendChild(
    document.createElement("link", {
        rel: "stylesheet",
        href: "plugin/beamer_header/theme_zx.css"
    })
);

class DocInfo {
    constructor({
        title,
        author,
        institude,
        date            = null,
        short_title     = null,
        short_author    = null,
        short_institude = null,
        logo            = null,
        thanks          = null} = {}
    ) {
        this.title = title;
        this.short_title = short_title || this.title;
        this.author = author;
        this.short_author = short_author || this.author;
        this.institude = institude;
        this.short_institude = short_institude || this.institude;
        this.logo = logo;
        this.thanks = thanks;
        if (! date) {
            let objectDate = new Date();
            this.date = `${objectDate.getFullYear()} 年 ${objectDate.getMonth() + 1} 月 ${objectDate.getDate()} 日`;
        } else {
            this.date = date;
        }
    }

    create_titlepage(title=null, author=null, institude=null, date=null, logo=null) {
        title = title || this.title;
        author = author || this.author;
        institude = institude || this.institude;
        date = date || this.date;
        logo = logo || this.logo;
        let first_section = document.getElementsByTagName("section")[0];
        let parentElement = first_section.parentElement;
        let section = document.createElement("section");
        section.innerHTML = `
            <h1 style="text-align: center; background-color: #f2f2f2;">
                ${title}
            </h1>
            <p style="text-align: center;">
                ${author}
            </p>
            <p style="text-align: center;">
                ${institude}
            </p>
            <p style="text-align: center;">
                ${date}
            </p>
            `;
        parentElement.insertBefore(section, first_section);
    }

    create_footers(title=null, author=null, institude=null) {
        title = title || this.short_title;
        author = author || this.short_author;
        institude = institude || this.short_institude;
        let section_list = document.getElementsByTagName("section");
        let frame_list = [];
        for (let i = 0; i < section_list.length; i++) {
            let v = section_list[i];
            if (v.getElementsByTagName("section").length == 0) {
                frame_list.push(v);
            }
        }
        let n_frame = frame_list.length;
        for (let i = 0; i < frame_list.length; i++) {
            let v = frame_list[i];
            let frame = v.getElementsByClassName("frame")[0];
            let parentNode = frame;
            if (! frame) {
                parentNode = v;
            }
            let footer = document.createElement("footer");
            footer.innerHTML = `
        <div style="text-align:left; flex: 0 0 auto;">${author}<br><a href='#/0'>${title}</a></div>
        <div style="flex: 1 0 auto;"></div>
        <div style="text-align:right; flex: 0 0 auto;">${institude}<br>${i+1} / ${n_frame}</div>
        `
            parentNode.appendChild(footer);
        }
    }

    create_padding() {
        let section_list = document.getElementsByTagName("section");
        let frame_list = [];
        for (let i = 0; i < section_list.length; i++) {
            let v = section_list[i];
            if (v.getElementsByTagName("section").length == 0) {
                frame_list.push(v);
            }
        }
        for (let i = 0; i < frame_list.length; i++) {
            let v = frame_list[i];
            let frame = v.getElementsByClassName("frame")[0];
            let parentNode = frame;
            if (! frame) {
                parentNode = v;
            }
            let title_list = getElementsByTagNames("h3,h4,header", v);
            let div_title = document.createElement("div");
            div_title.className = "content_padding";
            if (title_list.length > 0) {
                v.insertBefore(div_title, title_list[title_list.length-1].nextSibling);
            }
            let footer_list = v.getElementsByTagName("footer");
            let div_footer = document.createElement("div");
            div_footer.className = "content_padding";
            v.insertBefore(div_footer, footer_list[footer_list.length-1])
        }
        let h1_title = section_list[0].getElementsByTagName("h1")[0];
        let h1_div = document.createElement("div");
        h1_div.className = "content_padding";
        section_list[0].insertBefore(h1_div, h1_title);
        let h1_thanks = section_list[section_list.length-1].getElementsByTagName("h1")[0];
        let h1_div_thanks = document.createElement("div");
        h1_div_thanks.className = "content_padding";
        section_list[section_list.length-1].insertBefore(h1_div_thanks, h1_thanks);
    }

    create_headers() {
        // use https://tool.chinaz.com/tools/html_js.aspx
        // add svg symbol for header
        // 在 body (<script>) 中加入图标的 svg 内容
        document.writeln(`
        <svg style='display: none;'>
            <symbol id='other_page' viewbox='0 0 60 60'>
                <circle r='25' cx='30' cy='30' stroke-width='8' />
            </symbol>
        </svg>
        <svg style='display: none;'>
            <symbol id='this_page' viewbox='0 0 60 60'>
                <circle r='25' cx='30' cy='30' stroke-width='8' />
            </symbol>
        </svg>
        `)

        // frame_info_list: |i_frame|i_section|i_frame_in_section|content|
        //     i_frame: 0-n_frame (frame_info_list.length)
        //     i_section: -1 (no section, ex: title, tku), 0-n_section
        //     i_frame_in_section: 0-n_frame_in_section
        var frame_info_list = [];
        // section_info_list: |i_section|section_page|n_frame_in_section|section_title|
        var section_info_list = [];
        // 所有的 <section> 标签
        var section_list = document.getElementsByTagName("section");
        // 初始化 i_section 变量
        var i_section = -1;
        var section_horizontal_page = -1;

        // 对所有的 <section> 标签进行循环，每个为一个 frame
        for (var i_frame = 0; i_frame < section_list.length; i_frame++) {
            // add section info
            if (section_list[i_frame].parentElement.tagName != "SECTION") {
                section_horizontal_page += 1;
            }
            if (section_list[i_frame].getElementsByTagName("section").length > 0) {
                i_section += 1;
                i_frame_in_section = 0;
                section_info_list.push({
                    "i_section": i_section,
                    "section_page": i_frame,
                    "section_horizontal_page": section_horizontal_page,
                    "n_frame_in_section": section_list[i_frame].getElementsByTagName("section").length,
                    "section_title": section_list[i_frame].getAttribute("title"),
                    "section_short_title": section_list[i_frame].getAttribute("short_title"),
                })
            }
            // check in section, add frame info
            if ((section_list[i_frame].parentElement.tagName == "SECTION") || (section_list[i_frame].getElementsByTagName("section").length > 0)) {
                frame_info_list.push({
                    "i_frame": i_frame,
                    "i_section": i_section,
                    "i_frame_in_section": i_frame_in_section,
                    "content": section_list[i_frame],
                })
            } else {
                frame_info_list.push({
                    "i_frame": i_frame,
                    "i_section": -1,
                    "i_frame_in_section": -1,
                    "content": section_list[i_frame],
                })
            }
            i_frame_in_section += 1;
        }

        // 定义一个根据所在位置生成 header 的函数
        function get_header(i_section_this_frame, i_frame_in_section_this_frame) {
            var header = document.createElement("header");
            // 对所有的 section 循环
            for (var i_section = 0; i_section < section_info_list.length; i_section++) {
                // 如果多于1个section，则增加弹性的中间结构进行排版
                if (i_section > 0) {
                    var header_padding = document.createElement("div");
                    header_padding.className = "header_padding";
                    header.appendChild(header_padding);
                }
                // 创建header中的section内容
                var header_content = document.createElement("div");
                header_content.className = "header_content";
                header_content.style.opacity = i_section == i_section_this_frame ? 1 : 0.4;
                var section_basic_page = section_info_list[i_section]["section_horizontal_page"];
                // 获取 section 标题，先看 title，再看 short title，最后用默认的
                var section_title = section_info_list[i_section]["section_short_title"];
                if (!section_title) {
                    section_title = section_info_list[i_section]["section_title"];
                }
                if (!section_title) {
                    section_title = `Section ${i_section + 1}`;
                }
                // 加入跳转链接与换行
                header_content.innerHTML = "<a href='#/" + String(section_basic_page) + "'>" + section_title + "</a><br>";
                var n_frame_in_section = section_info_list[i_section]["n_frame_in_section"];
                // 对该 section 的所有 frame 进行循环，增加标识符号
                for (var i_frame_in_section = 0; i_frame_in_section < n_frame_in_section; i_frame_in_section++) {
                    var a = document.createElement("a");
                    a.href = `#/${section_basic_page}/${i_frame_in_section + 1}`;
                    // 判断是否是当前 frame，并使用对应标识
                    if ((i_frame_in_section + 1 == i_frame_in_section_this_frame) && (i_section == i_section_this_frame)) {
                        a.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg'><use href='#this_page'></use></svg>";
                    } else {
                        a.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg'><use href='#other_page'></use></svg>";
                    }
                    header_content.appendChild(a);
                }
                header.appendChild(header_content);
            }
            return header
        }

        // 给所有的 section（部分）添加一个目录页
        for (var i_section = 0; i_section < section_info_list.length; i_section++) {
            var section_page = section_info_list[i_section]["section_page"];
            var parentNode = frame_info_list[section_page]["content"];
            var theFirstChildren = frame_info_list[section_page + 1]["content"];
            var section = document.createElement("section");
            var h3 = document.createElement("h3");
            h3.innerHTML = "Table of Contents";
            section.appendChild(h3);
            var ol = document.createElement("ol");
            ol.className = "TOC";
            for (let i = 0; i < section_info_list.length; i++) {
                let li = document.createElement("li");
                li.innerHTML = `<a href="#/${section_info_list[i]["section_horizontal_page"]}">${section_info_list[i]["section_title"]}</a>`;
                if (i != i_section) {
                    li.style.opacity = 0.4;
                }
                ol.appendChild(li);
            }
            section.appendChild(ol);
            parentNode.insertBefore(section, theFirstChildren);
            frame_info_list[section_page]["content"] = section;
        }

        // 给所有的页面添加一个 header
        for (var i_frame = 0; i_frame < frame_info_list.length; i_frame++) {
            if (frame_info_list[i_frame]["i_section"] >= 0) {
                var parentNode = frame_info_list[i_frame]["content"].children[0];
                if (parentNode.className != "frame") {
                    parentNode = parentNode.parentNode;
                }
                var firstChildrenNode = parentNode.children[0];
                var i_section = frame_info_list[i_frame]["i_section"];
                var i_frame_in_section = frame_info_list[i_frame]["i_frame_in_section"];
                var header = get_header(i_section, i_frame_in_section);
                parentNode.insertBefore(header, firstChildrenNode);
            }
        }
    }

    create_thankspage (thanks=null) {
        thanks = thanks || "Thanks!";
        let section_list = document.getElementsByTagName("section");
        let first_section = section_list[0];
        let parentElement = first_section.parentElement;
        let section = document.createElement("section");
        section.innerHTML = `
            <h1 style="text-align: center; background-color: #f2f2f2;">
                ${thanks}
            </h1>
            `;
        parentElement.appendChild(section);
    }
}

function getElementsByTagNames (list,obj)
{
	// 如果对象不存在，则将对象设置为document
	if (!obj)
	{
		var obj=document;
	};
	var tagNames=list.split(','); // 将要搜索的list分割，获取列表
	var resultArray=new Array(); // 构造返回结果的列表
	// 对tag列表进行循环
	for (var i=0;i<tagNames.length;i++)
	{
		var tags=obj.getElementsByTagName(tagNames[i]); // 获取相关tag的元素内容
		// 对所有该tag的元素进行循环
		for (var j=0;j<tags.length;j++)
		{
			resultArray.push(tags[j]); // 在结果列表中追加这个tag元素
		};
	};
	var testNode=resultArray[0]; // 定义一个新的变量 testNode
	// 如果 testNode 不存在，则返回空值
	if (!testNode)
	{
		return [];
	};
	// 如果 testNode.sourceIndex 存在
	if (testNode.sourceIndex)
	{
		resultArray.sort(
			function (a,b)
			{
				return a.sourceIndex-b.sourceIndex;
			}
		); // 对结果列表进行排序，根据元素的 sourceIndex 进行排序
	}
	else if (testNode.compareDocumentPosition) // 或者 compareDocumentPosition 存在
	{
		resultArray.sort(
			function (a,b)
			{
				return 3-(a.compareDocumentPosition(b)&6);
			}
		); // 使用 3-(a.compareDocumentPosition(b)&6) 进行排序
	};
	return resultArray; // 返回结果列表
};