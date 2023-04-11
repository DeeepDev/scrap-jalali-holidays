# What is this library?

This library can be used for extracting jalali holidays from badesaba.ir API. It has a CLI by which you can specify a range of dates and get the holidays in that range.

# How to use the CLI?

```bash
scrap-jalali-holidays [options]
```

| Option                      | Description                        | Default |
| --------------------------- | --------------------------------   | ------- |
| --from <from>               | from date (YYYY-MM format)         | 1350-01 |
| --to <to>                   | to date (YYYY-MM format)           | 1450-12 |
| --scrap-occasions           | whether to scrap occasions or not  | false   |
| --output-ext <output-ext>   | extension of output file (js|json) | js      |
| --output-dir <output-dir>   | directory of output file           | N/A     |

There is a field `created_at` in the output json, which the script uses later to override the `from` date, so if you want to opt out of this feature, you can use `--force-update` option.
