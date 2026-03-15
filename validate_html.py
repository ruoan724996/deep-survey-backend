#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
HTML 结构验证脚本
修改 HTML 文件后必须运行此脚本验证
"""

import sys
from pathlib import Path

def validate_html_structure(html_file: str) -> bool:
    """验证 HTML 文件结构"""
    
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查 div 标签配对
    open_divs = content.count('<div')
    close_divs = content.count('</div>')
    
    print("=" * 50)
    print("🔍 HTML 结构验证")
    print("=" * 50)
    print(f"文件：{html_file}")
    print(f"开标签：<div = {open_divs}")
    print(f"闭标签：</div> = {close_divs}")
    print(f"差值：{open_divs - close_divs}")
    
    if open_divs != close_divs:
        print("❌ 验证失败：div 标签不配对！")
        return False
    
    # 检查 form 标签配对
    open_forms = content.count('<form')
    close_forms = content.count('</form>')
    
    print(f"\n开标签：<form = {open_forms}")
    print(f"闭标签：</form> = {close_forms}")
    print(f"差值：{open_forms - close_forms}")
    
    if open_forms != close_forms:
        print("❌ 验证失败：form 标签不配对！")
        return False
    
    # 检查常见结构问题
    issues = []
    
    # 检查是否有空的 form-group
    if '<div class="form-group">\n                        </div>' in content:
        issues.append("发现空的 form-group 标签")
    
    # 检查是否有未闭合的标签
    if content.count('<textarea') != content.count('</textarea>'):
        issues.append("textarea 标签未闭合")
    
    if content.count('<input') != content.count('<input>') and content.count('<input') != content.count('<input />'):
        # input 是自闭合标签，不需要单独检查
        pass
    
    if issues:
        print("\n⚠️  发现潜在问题：")
        for issue in issues:
            print(f"  - {issue}")
        print("\n❌ 验证失败！")
        return False
    
    print("\n✅ 验证通过：HTML 结构正确")
    print("=" * 50)
    return True


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("用法：python3 validate_html.py <html 文件>")
        print("示例：python3 validate_html.py public/index.html")
        sys.exit(1)
    
    html_file = sys.argv[1]
    
    if not Path(html_file).exists():
        print(f"❌ 文件不存在：{html_file}")
        sys.exit(1)
    
    success = validate_html_structure(html_file)
    sys.exit(0 if success else 1)
