import json


WORLDS = [
    "新手村",
    "判断森林",
    "循环矿洞",
    "函数神殿",
    "容器仓库",
    "Bug 修理厂",
    "AI 实验室",
]


def make_level(
    idx: int,
    world: str,
    world_order: int,
    level_order: int,
    title: str,
    description: str,
    concept_tags: list[str],
    starter_code: str,
    answer_code: str,
    test_cases: list[dict],
    hints: list[str],
    difficulty: str,
    knowledge_point: str,
) -> dict:
    return {
        "id": f"level-{idx:02d}",
        "world": world,
        "world_order": world_order,
        "level_order": level_order,
        "title": title,
        "description": description,
        "concept_tags": json.dumps(concept_tags, ensure_ascii=False),
        "starter_code": starter_code,
        "answer_code": answer_code,
        "test_cases": json.dumps(test_cases, ensure_ascii=False),
        "hints": json.dumps(hints, ensure_ascii=False),
        "difficulty": difficulty,
        "knowledge_point": knowledge_point,
        "xp_reward": 15 + world_order * 5,
        "coin_reward": 8 + level_order * 2,
    }


LEVELS = [
    make_level(1, "新手村", 1, 1, "你好，PyRunner", "使用 print 输出 Hello, PyRunner!", ["print"], "print()\n", "print('Hello, PyRunner!')\n", [{"type": "stdout", "expected": "Hello, PyRunner!"}], ["print 里放入字符串。", "记得保留感叹号。"], "beginner", "print"),
    make_level(2, "新手村", 1, 2, "双行欢迎语", "输出两行文字：第一行 Welcome，第二行 Python!", ["print", "string"], "print('Welcome')\n", "print('Welcome')\nprint('Python!')\n", [{"type": "stdout_lines", "expected": ["Welcome", "Python!"]}], ["可以连续写两次 print。"], "beginner", "print"),
    make_level(3, "新手村", 1, 3, "名字变量", "定义变量 name='Ada'，输出 Hello, Ada", ["variable", "string"], "name = ''\nprint()\n", "name = 'Ada'\nprint('Hello, ' + name)\n", [{"type": "stdout", "expected": "Hello, Ada"}], ["先把名字存进变量。", "字符串拼接可以用 + 。"], "beginner", "变量"),
    make_level(4, "新手村", 1, 4, "计算金币", "定义变量 coins=7，再输出 coins + 5 的结果", ["number", "variable"], "coins = 7\n# 输出结果\n", "coins = 7\nprint(coins + 5)\n", [{"type": "stdout", "expected": "12"}], ["print 可以直接打印表达式。"], "beginner", "数字计算"),
    make_level(5, "判断森林", 2, 1, "温度判断", "变量 temp=31。若 temp >= 30 输出 Hot，否则输出 Nice", ["if", "else"], "temp = 31\n", "temp = 31\nif temp >= 30:\n    print('Hot')\nelse:\n    print('Nice')\n", [{"type": "stdout", "expected": "Hot"}], ["先写 if 条件。", "别忘了冒号和缩进。"], "beginner", "if/else"),
    make_level(6, "判断森林", 2, 2, "偶数侦测", "变量 num=8。若是偶数输出 even，否则输出 odd", ["if", "mod"], "num = 8\n", "num = 8\nif num % 2 == 0:\n    print('even')\nelse:\n    print('odd')\n", [{"type": "stdout", "expected": "even"}], ["偶数除以 2 余数为 0。"], "beginner", "if/else"),
    make_level(7, "判断森林", 2, 3, "登录口令", "变量 code='pyrunner'。正确则输出 Access granted，否则输出 Try again", ["if", "string"], "code = 'pyrunner'\n", "code = 'pyrunner'\nif code == 'pyrunner':\n    print('Access granted')\nelse:\n    print('Try again')\n", [{"type": "stdout", "expected": "Access granted"}], ["字符串判断使用 ==。"], "beginner", "字符串判断"),
    make_level(8, "判断森林", 2, 4, "成绩评级", "score=86。90+ 输出 A，80+ 输出 B，否则输出 C", ["if", "elif"], "score = 86\n", "score = 86\nif score >= 90:\n    print('A')\nelif score >= 80:\n    print('B')\nelse:\n    print('C')\n", [{"type": "stdout", "expected": "B"}], ["这个题适合 if / elif / else。"], "normal", "条件分支"),
    make_level(9, "循环矿洞", 3, 1, "数到三", "使用 for 循环输出 1 到 3，每行一个数字", ["for", "range"], "for i in range():\n    pass\n", "for i in range(1, 4):\n    print(i)\n", [{"type": "stdout_lines", "expected": ["1", "2", "3"]}], ["range(1, 4) 会得到 1、2、3。"], "beginner", "for"),
    make_level(10, "循环矿洞", 3, 2, "累计求和", "计算 1 到 5 的总和并输出", ["for", "sum"], "total = 0\n", "total = 0\nfor i in range(1, 6):\n    total += i\nprint(total)\n", [{"type": "stdout", "expected": "15"}], ["先准备 total，再循环累加。"], "normal", "循环累加"),
    make_level(11, "循环矿洞", 3, 3, "while 倒计时", "使用 while 输出 3、2、1、Go!", ["while"], "count = 3\n", "count = 3\nwhile count > 0:\n    print(count)\n    count -= 1\nprint('Go!')\n", [{"type": "stdout_lines", "expected": ["3", "2", "1", "Go!"]}], ["循环里记得修改 count。"], "normal", "while"),
    make_level(12, "循环矿洞", 3, 4, "找到第一个大于 10 的数", "numbers=[3,7,11,15]，输出第一个大于 10 的数字", ["for", "if", "list"], "numbers = [3, 7, 11, 15]\n", "numbers = [3, 7, 11, 15]\nfor number in numbers:\n    if number > 10:\n        print(number)\n        break\n", [{"type": "stdout", "expected": "11"}], ["遍历列表后遇到目标就 break。"], "normal", "循环与条件"),
    make_level(13, "函数神殿", 4, 1, "打招呼函数", "定义 greet()，调用后输出 Hi!", ["function"], "def greet():\n    pass\n", "def greet():\n    print('Hi!')\n\ngreet()\n", [{"type": "stdout", "expected": "Hi!"}], ["定义函数后别忘了调用。"], "beginner", "函数"),
    make_level(14, "函数神殿", 4, 2, "双倍函数", "定义 double(n) 返回 n*2，然后打印 double(6)", ["function", "return"], "def double(n):\n    pass\n", "def double(n):\n    return n * 2\n\nprint(double(6))\n", [{"type": "stdout", "expected": "12"}], ["有返回值时使用 return。"], "normal", "函数返回值"),
    make_level(15, "函数神殿", 4, 3, "姓名格式化", "定义 format_name(first, last)，返回 'last, first'，打印 Ada 和 Lovelace 的结果", ["function", "string"], "def format_name(first, last):\n    pass\n", "def format_name(first, last):\n    return last + ', ' + first\n\nprint(format_name('Ada', 'Lovelace'))\n", [{"type": "stdout", "expected": "Lovelace, Ada"}], ["按题目要求拼接字符串。"], "normal", "函数参数"),
    make_level(16, "函数神殿", 4, 4, "统计元音", "定义 count_vowels(text) 返回字符串中元音字母数量，打印 count_vowels('banana')", ["function", "for", "if"], "def count_vowels(text):\n    count = 0\n    # your code\n", "def count_vowels(text):\n    count = 0\n    for ch in text:\n        if ch in 'aeiou':\n            count += 1\n    return count\n\nprint(count_vowels('banana'))\n", [{"type": "stdout", "expected": "3"}], ["可以逐个遍历字符。"], "pro", "函数与文本处理"),
    make_level(17, "容器仓库", 5, 1, "列表长度", "fruits=['apple','banana','pear']，输出列表长度", ["list", "len"], "fruits = ['apple', 'banana', 'pear']\n", "fruits = ['apple', 'banana', 'pear']\nprint(len(fruits))\n", [{"type": "stdout", "expected": "3"}], ["列表长度用 len。"], "beginner", "list"),
    make_level(18, "容器仓库", 5, 2, "字典取值", "profile={'name':'Mia','city':'Shanghai'}，输出 city", ["dict"], "profile = {'name': 'Mia', 'city': 'Shanghai'}\n", "profile = {'name': 'Mia', 'city': 'Shanghai'}\nprint(profile['city'])\n", [{"type": "stdout", "expected": "Shanghai"}], ["字典取值用方括号。"], "beginner", "dict"),
    make_level(19, "容器仓库", 5, 3, "元组坐标", "point=(2,5)，输出第二个值", ["tuple"], "point = (2, 5)\n", "point = (2, 5)\nprint(point[1])\n", [{"type": "stdout", "expected": "5"}], ["索引从 0 开始。"], "beginner", "tuple"),
    make_level(20, "容器仓库", 5, 4, "集合去重", "numbers=[1,1,2,3,3,4]。把它转成 set 并输出去重后元素个数", ["set", "list"], "numbers = [1, 1, 2, 3, 3, 4]\n", "numbers = [1, 1, 2, 3, 3, 4]\nunique_numbers = set(numbers)\nprint(len(unique_numbers))\n", [{"type": "stdout", "expected": "4"}], ["set 会自动去重。"], "normal", "set"),
    make_level(21, "容器仓库", 5, 5, "词频登记", "words=['hi','python','hi']，构造字典 counts 统计每个单词次数，并输出 counts['hi']", ["dict", "for"], "words = ['hi', 'python', 'hi']\ncounts = {}\n", "words = ['hi', 'python', 'hi']\ncounts = {}\nfor word in words:\n    counts[word] = counts.get(word, 0) + 1\nprint(counts['hi'])\n", [{"type": "stdout", "expected": "2"}], ["可以用 dict.get 提供默认值。"], "pro", "dict 统计"),
    make_level(22, "Bug 修理厂", 6, 1, "安全除法", "用 try/except 捕获 10/0 的错误，输出 Oops", ["try", "except"], "try:\n    print(10 / 0)\nexcept:\n    pass\n", "try:\n    print(10 / 0)\nexcept ZeroDivisionError:\n    print('Oops')\n", [{"type": "stdout", "expected": "Oops"}], ["捕获异常后输出指定文本。"], "normal", "异常"),
    make_level(23, "Bug 修理厂", 6, 2, "数字转换", "text='42'，把它转成整数并输出加 8 后的结果", ["int", "string"], "text = '42'\n", "text = '42'\nnumber = int(text)\nprint(number + 8)\n", [{"type": "stdout", "expected": "50"}], ["int('42') 会得到整数。"], "beginner", "类型转换"),
    make_level(24, "Bug 修理厂", 6, 3, "坏数据处理", "items=['1','2','x','4']。把能转成 int 的值累加，输出结果", ["try", "except", "for"], "items = ['1', '2', 'x', '4']\n", "items = ['1', '2', 'x', '4']\ntotal = 0\nfor item in items:\n    try:\n        total += int(item)\n    except ValueError:\n        continue\nprint(total)\n", [{"type": "stdout", "expected": "7"}], ["遇到坏数据时跳过它。"], "pro", "异常与循环"),
    make_level(25, "Bug 修理厂", 6, 4, "修好缩进", "修复下面函数，让它返回参数的平方并打印 square(4)", ["function"], "def square(n):\nreturn n * n\n\nprint(square(4))\n", "def square(n):\n    return n * n\n\nprint(square(4))\n", [{"type": "stdout", "expected": "16"}], ["函数体需要缩进。"], "beginner", "缩进"),
    make_level(26, "AI 实验室", 7, 1, "标题清洗器", "text='  py runner  '。去掉首尾空格并转成大写输出", ["string", "text"], "text = '  py runner  '\n", "text = '  py runner  '\nprint(text.strip().upper())\n", [{"type": "stdout", "expected": "PY RUNNER"}], ["先 strip 再 upper。"], "normal", "字符串处理"),
    make_level(27, "AI 实验室", 7, 2, "单词计数器", "sentence='I love python learning'，输出单词数量", ["split", "len"], "sentence = 'I love python learning'\n", "sentence = 'I love python learning'\nwords = sentence.split()\nprint(len(words))\n", [{"type": "stdout", "expected": "4"}], ["split 会按空格拆词。"], "normal", "文本处理"),
    make_level(28, "AI 实验室", 7, 3, "反转字符串", "输出 'python' 反转后的结果", ["slice", "string"], "text = 'python'\n", "text = 'python'\nprint(text[::-1])\n", [{"type": "stdout", "expected": "nohtyp"}], ["步长写成 -1。"], "normal", "切片"),
    make_level(29, "AI 实验室", 7, 4, "敏感词过滤", "text='python is fun'。把 fun 替换成 awesome 并输出", ["replace", "string"], "text = 'python is fun'\n", "text = 'python is fun'\nprint(text.replace('fun', 'awesome'))\n", [{"type": "stdout", "expected": "python is awesome"}], ["使用 replace(old, new)。"], "beginner", "字符串替换"),
    make_level(30, "AI 实验室", 7, 5, "简易成绩报告", "scores={'Ada':95,'Bob':88,'Cici':91}。遍历字典，输出分数 >= 90 的名字，每行一个", ["dict", "for", "if"], "scores = {'Ada': 95, 'Bob': 88, 'Cici': 91}\n", "scores = {'Ada': 95, 'Bob': 88, 'Cici': 91}\nfor name, score in scores.items():\n    if score >= 90:\n        print(name)\n", [{"type": "stdout_lines_unordered", "expected": ["Ada", "Cici"]}], ["遍历字典可用 items()。"], "pro", "字典遍历"),
]


BADGES = [
    {"code": "first_clear", "name": "初次通关", "description": "完成任意 1 关", "icon": "🏁", "unlock_rule": "complete_1_level"},
    {"code": "streak_3", "name": "三日热身", "description": "连续学习 3 天", "icon": "🔥", "unlock_rule": "streak_3"},
    {"code": "debugger", "name": "Bug 修理师", "description": "完成 Bug 修理厂全部关卡", "icon": "🛠", "unlock_rule": "clear_bug_world"},
    {"code": "ai_friend", "name": "AI 搭子", "description": "使用 5 次 AI 教练", "icon": "🤖", "unlock_rule": "ai_5_times"},
]
