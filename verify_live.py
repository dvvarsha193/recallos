import urllib.request

url = "https://dvvarsha193.github.io/recallos/"
with urllib.request.urlopen(url) as resp:
    html = resp.read().decode('utf-8')
    print("Full HTML length:", len(html))
    print(html[:600])
