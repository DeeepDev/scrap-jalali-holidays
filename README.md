# What is this repository?

This repo can be used for extracting jalali holidays from badesaba.ir API. It has a CLI by which you can specify a range of dates and get the holidays in that range.

# How to use the CLI?

```bash
scrap-jalali-holidays [options]
```

| Option                      | Description                      | Default |
| --------------------------- | -------------------------------- | ------- |
| --from-year <from-year>     | from year                        | 1300    |
| --from-month <from-month>   | from month                       | 1       |
| --to-year <to-year>         | to year                          | 1450    |
| --to-month <to-month>       | to month                         | 12      |
| --force-update              | force update the json completely | false   |
| --output-file <output-file> | path of output file              | N/A     |

There is a field `created_at` in the json, which the script uses to override the `from` date, so if you want to opt out of this feature, you can use `--force-update` option.
