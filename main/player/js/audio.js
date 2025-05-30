// 获取主题背景
var body = document.getElementById('body');
// 获取音频播放器对象
var audio = document.getElementById('audioTag');

// 歌曲名
var musicTitle = document.getElementById('music-title');
// 歌曲海报
var recordImg = document.getElementById('record-img');
// 歌曲作者
var author = document.getElementById('author-name');

// 进度条
var progress = document.getElementById('progress');
// 总进度条
var progressTotal = document.getElementById('progress-total');

// 已进行时长
var playedTime = document.getElementById('playedTime');
// 总时长
var audioTime = document.getElementById('audioTime');

// 播放模式按钮
var mode = document.getElementById('playMode');
// 上一首
var skipForward = document.getElementById('skipForward');
// 暂停按钮
var pause = document.getElementById('playPause');
// 下一首
var skipBackward = document.getElementById('skipBackward');
// 音量调节
var volume = document.getElementById('volume');
// 音量调节滑块
var volumeTogger = document.getElementById('volumn-togger');

// 列表
var list = document.getElementById('list');
// 倍速
var speed = document.getElementById('speed');
// MV
var MV = document.getElementById('MV');

// 左侧关闭面板
var closeList = document.getElementById('close-list');
// 音乐列表面板
var musicList = document.getElementById('music-list');




// 暂停/播放功能实现
// 为pause元素（即播放/暂停按钮）添加了一个点击事件监听器。当用户点击该按钮时，会触发这个匿名函数。
pause.onclick = function (e) {
    // audio.paused 是一个布尔值，表示音频当前是否暂停。
    if (audio.paused) {
        audio.play();
        rotateRecord();
        // 从pause按钮中移除名为icon-play的CSS类,添加pause
        pause.classList.remove('icon-play');
        pause.classList.add('icon-pause');
    } else {
        audio.pause();
        rotateRecordStop();
        pause.classList.remove('icon-pause');
        pause.classList.add('icon-play');
    }
}

// 更新进度条

// addEventListener：这是用来为指定元素添加事件监听器的方法。这里它用于监听 audio 元素上的特定事件。
// 'timeupdate'：这是 HTML5 音频/视频元素的一个事件，当播放位置改变时（例如，每当浏览器获取新的音频数据或用户拖动进度条）就会触发此事件。
// updateProgress：这是当 'timeupdate' 事件触发时要调用的回调函数名。每当音频播放位置发生变化时，都会执行这个函数来更新进度条。
audio.addEventListener('timeupdate', updateProgress); // 监听音频播放时间并更新进度条
function updateProgress() {
    // 用来获取value方便进度条的设置
    var value = audio.currentTime / audio.duration;
    // 设置进度条 (progress) 的宽度。value * 100 将上述计算出的比例转换为百分比形式，然后将其赋值给进度条的 width 样式属性。这会使得进度条随着音频播放逐渐变长，直观地反映出播放进度。
    progress.style.width = value * 100 + '%';
    // palyedTime用于展示当前已经播放的时间长度。transTime(audio.currentTime)它接受音频的当前播放时间作为参数并传给innerText
    playedTime.innerText = transTime(audio.currentTime);
}

//音频播放时间换算
function transTime(value) {
    // 创建一个空字符串 time，用于存储最终格式化后的时间字符串。
    var time = "";
    var h = parseInt(value / 3600);
    value %= 3600;
    var m = parseInt(value / 60);
    var s = parseInt(value % 60);
    if (h > 0) {
        time = formatTime(h + ":" + m + ":" + s);
    } else {
        time = formatTime(m + ":" + s);
    }

    return time;
}

// 格式化时间显示，补零对齐
function formatTime(value) {
    var time = "";
    // 使用 split 方法根据冒号 : 将输入的时间字符串分割成数组
    var s = value.split(':');
    var i = 0;
    // 条件 (i < s.length - 1)：确保循环不会处理最后一个元素，因为在每次迭代后都会添加一个冒号 ":"
    for (; i < s.length - 1; i++) {
        // 检查当前时间片段是否仅为一位数。如果是，则在其前面加上一个零以确保两位数格式；如果不是，则直接添加原样。
        time += s[i].length == 1 ? ("0" + s[i]) : s[i];
        // 每次迭代结束时添加冒号
        time += ":";
    }
    // s 中的最后一项。因为上面的循环没有处理到最后一个元素要单独加上
    // 同样使用三元运算符来检查最后一个时间片段是否需要补零，并将其追加到 time 字符串中。
    time += s[i].length == 1 ? ("0" + s[i]) : s[i];

    return time;
}

// 点击进度条跳到指定点播放

// progressTotal是一个指向进度条元素的引用，为 progressTotal 元素添加一个 'mousedown' 事件监听器，当用户按下鼠标按钮时触发。
progressTotal.addEventListener('mousedown', function (event) {
    // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
    if (!audio.paused || audio.currentTime != 0) {

        // window.getComputedStyle(progressTotal, null)：获取 progressTotal 元素的所有计算样式。
        // .width：从计算样式中提取宽度属性。
        // .replace('px', '')：移除宽度字符串中的 "px" 单位，以便将其转换为纯数字。
        // parseFloat(...)：将宽度字符串转换为浮点数，得到进度条的实际宽度值（单位为像素）。这一步是为了后续计算点击位置相对于进度条的比例。
        
var pgsWidth = parseFloat(window.getComputedStyle(progressTotal, null).width.replace('px', ''));

// event.offsetX：获取鼠标点击位置相对于进度条左边缘的水平偏移量（单位为像素）。
// / pgsWidth：将点击位置的偏移量除以进度条的总宽度，得到一个介于 0 和 1 之间的比例值，表示点击位置在整个进度条中的相对位置。        
var rate = event.offsetX / pgsWidth;
        audio.currentTime = audio.duration * rate;
        updateProgress(audio);
    }
});

// 点击列表展开音乐列表
// 为 list 元素添加一个 'click' 事件监听器
list.addEventListener('click', function (event) {
    // 移除 musicList 上名为 "list-card-hide" 的CSS类。
    musicList.classList.remove("list-card-hide");
    musicList.classList.add("list-card-show");
    // 直接设置 musicList 的内联样式属性 display 为 "flex"，确保它以弹性盒模型布局显示。
    musicList.style.display = "flex";
    closeList.style.display = "flex";
    // closeList 元素添加一个 'click' 事件监听器，当用户点击关闭按钮时触发。
    closeList.addEventListener('click', closeListBoard);
});

// 点击关闭面板关闭音乐列表
function closeListBoard() {
    musicList.classList.remove("list-card-show");
    musicList.classList.add("list-card-hide");
    closeList.style.display = "none";
}

// 存储当前播放的音乐序号
var musicId = 0;

// 后台音乐列表
let musicData = [['天下', '张杰'], ['看月亮爬上来', '张杰'], ['写给黄淮', '邵帅'], ['追光者', '岑宁儿']];

// 初始化音乐
function initMusic() {
    audio.src = "mp3/music" + musicId.toString() + ".mp3";
    // 调用 load() 方法告诉浏览器重新加载音频资源，确保新设置的 src 被正确加载
    audio.load();
    // 停止唱片旋转动画
    recordImg.classList.remove('rotate-play');

    // audio.ondurationchange：设置一个事件监听器，在音频的 duration 属性发生变化时触发。这个事件通常会在音频元数据加载完成后发生，即音频的总时长已知时。
    audio.ondurationchange = function () {
        musicTitle.innerText = musicData[musicId][0];
        author.innerText = musicData[musicId][1];
        recordImg.style.backgroundImage = "url('img/record"+musicId.toString()+".jpg')";
        body.style.backgroundImage = "url('img/bg"+musicId.toString()+".png')";
        audioTime.innerText = transTime(audio.duration);
        // 重置进度条
        audio.currentTime = 0;
        updateProgress();
        // 用来重新启动唱片的旋转动画。
        refreshRotate();
    }
}
initMusic();

// 初始化并播放
function initAndPlay() {
    initMusic();
    pause.classList.remove('icon-play');
    pause.classList.add('icon-pause');
    audio.play();
    rotateRecord();
}

// 播放模式设置
var modeId = 1;
// 指向播放模式按钮的DOM元素。
mode.addEventListener('click', function (event) {
    modeId = modeId + 1;
    if (modeId > 3) {
        modeId = 1;
    }
    mode.style.backgroundImage = "url('img/mode" + modeId.toString() + ".png')";
});

// onended：这是一个事件属性，当音频或视频文件播放完毕时触发。
audio.onended = function () {
    if (modeId == 2) {
        // 跳转至下一首歌
        musicId = (musicId + 1) % 4;
    }
    else if (modeId == 3) {
        // 随机生成下一首歌的序号
        var oldId = musicId;
        while (true) {
            musicId = Math.floor(Math.random() * 3) + 0;
            if (musicId != oldId) { break; }
        }
    }
    initAndPlay();
}

// 上一首
skipForward.addEventListener('click', function (event) {
    musicId = musicId - 1;
    if (musicId < 0) {
        musicId = 3;
    }
    initAndPlay();
});

// 下一首
skipBackward.addEventListener('click', function (event) {
    musicId = musicId + 1;
    if (musicId > 3) {
        musicId = 0;
    }
    initAndPlay();
});

// 倍速功能
// speed：指向速度控制按钮的DOM元素。
speed.addEventListener('click', function (event) {
    var speedText = speed.innerText;
    if (speedText == "1.0X") {
        // 下一个速度
        speed.innerText = "1.5X";
        audio.playbackRate = 1.5;
    }
    else if (speedText == "1.5X") {
        speed.innerText = "2.0X";
        audio.playbackRate = 2.0;
    }
    else if (speedText == "2.0X") {
        speed.innerText = "0.5X";
        audio.playbackRate = 0.5;
    }
    else if (speedText == "0.5X") {
        speed.innerText = "1.0X";
        audio.playbackRate = 1.0;
    }
});

// MV功能
MV.addEventListener('click', function (event) {
    // 向新窗口传值
    var storage_list = window.sessionStorage;
    storage_list['musicId'] = musicId;
    window.open("video.html");
});

// 暴力捆绑列表音乐
// document.getElementById("music0")：获取ID为 "music0" 的DOM元素
document.getElementById("music0").addEventListener('click', function (event) {
    musicId = 0;
    initAndPlay();
});
document.getElementById("music1").addEventListener('click', function (event) {
    musicId = 1;
    initAndPlay();
});
document.getElementById("music2").addEventListener('click', function (event) {
    musicId = 2;
    initAndPlay();
});
document.getElementById("music3").addEventListener('click', function (event) {
    musicId = 3;
    initAndPlay();
});

// 刷新唱片旋转角度
function refreshRotate() {
    recordImg.classList.add('rotate-play');
}

// 使唱片旋转
function rotateRecord() {
    recordImg.style.animationPlayState = "running"
}

// 停止唱片旋转
function rotateRecordStop() {
    recordImg.style.animationPlayState = "paused"
}

// 存储上一次的音量
var lastVolumn = 70

// 滑块调节音量
// 'timeupdate' 事件监听器，当音频播放位置发生变化时触发。
audio.addEventListener('timeupdate', updateVolumn);
function updateVolumn() {
    audio.volume = volumeTogger.value / 70;
}

// 点击音量调节设置静音
volume.addEventListener('click', setNoVolumn);
function setNoVolumn() {
    if (volumeTogger.value == 0) {
        // 用户可能在应用程序启动时或加载页面时就处于静音状态（volumeTogger.value 为 0）。防止静音的时候系统认为在有声音
        if (lastVolumn == 0) {
            lastVolumn = 70;
        }
        volumeTogger.value = lastVolumn;
        volume.style.backgroundImage = "url('img/音量.png')";
    }
    else {
        lastVolumn = volumeTogger.value;
        volumeTogger.value = 0;
        volume.style.backgroundImage = "url('img/静音.png')";
    }
}