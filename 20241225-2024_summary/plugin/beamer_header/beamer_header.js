// 在网页 head 中加入 css 引用
document.getElementsByTagName("head")[0].appendChild(
    document.createElement("link", {
        rel: "stylesheet",
        href: "plugin/beamer_header/theme_zx.css"
    })
);

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
    var frame = document.createElement("div");
    frame.className = "frame";
    var h3 = document.createElement("h3");
    h3.innerHTML = "Table of Contents";
    frame.appendChild(h3);
    var content = document.createElement("div");
    content.className = "content";
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
    content.appendChild(ol);
    frame.appendChild(content);
    section.appendChild(frame);
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