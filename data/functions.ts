// data/functions.ts

export type FunctionItem = {
  id: string;
  title: string;
  category: "Character Functions" | "Numeric Functions" | "Date Formats";
  overview: string;
  behavior?: string;
  sas: string;
  r: string;
  details: string;
  exampleSAS: string;
  exampleR: string;
  output?: string;
  outputTable?: string;
};

// =====================================================
  // CHARACTER FUNCTIONS
  // =====================================================
  export const contentData: FunctionItem[] = [

  {
  id: "strip-trimws",
  category: "Character Functions",
  title: "STRIP | trimws",
  overview:
    "Removes leading and trailing white spaces from character strings.",
  sas: "strip(var)",
  r: "trimws(var)",
  behavior:
    "Behavior is the same. Both remove leading and trailing spaces only.",
  details:
    "Good practice to apply to character variables before comparison or merge to avoid formatting inconsistencies.",

  exampleSAS: `data dm;
  input USUBJID $ SITEID $;
datalines;
101-001    001
;
run;

data dm2;
  set dm;
  SITEID_CLEAN = strip(SITEID);
run;`,

  exampleR: `library(dplyr)

dm <- data.frame(
  USUBJID="101-001",
  SITEID=" 001 "
)

dm <- dm %>%
  mutate(SITEID_CLEAN = trimws(SITEID))`,

  outputTable: `
USUBJID   SITEID   SITEID_CLEAN
101-001   001      001
`
},
{
  id: "put-ascharacter",
  category: "Character Functions",
  title: "PUT | as.character",
  overview:
    "Converts numeric values to character format.",
  sas: "put(AVAL, best.)",
  r: "as.character(AVAL)",
  behavior:
    "SAS requires a format (BEST.). R converts directly without format specification.",
  details:
    "Commonly used to convert numeric AVAL into character AVALC for reporting or display.",

  exampleSAS: `data adlb;
  input USUBJID $ AVAL;
datalines;
101-001 45
;
run;

data adlb2;
  set adlb;
  AVALC = put(AVAL, best.);
run;`,

  exampleR: `library(dplyr)

adlb <- data.frame(
  USUBJID="101-001",
  AVAL=45
)

adlb <- adlb %>%
  mutate(AVALC = as.character(AVAL))`,

  outputTable: `
USUBJID   AVAL   AVALC
101-001   45     45
`
},
{
  id: "cat-paste0",
  category: "Character Functions",
  title: "CAT | paste0",
  overview:
    "Concatenates two or more character strings without a delimiter.",
  sas: "cat(var1,var2)",
  r: "paste0(var1,var2)",
  behavior:
    "CAT strips blanks automatically. paste0 does not strip blanks unless handled separately.",
  details:
    "Used to combine variables without separators, for example USUBJID and SEX.",

  exampleSAS: `data adsl;
  input USUBJID $ SEX $;
datalines;
101-001 M
;
run;

data adsl2;
  set adsl;
  IDSEX = cat(USUBJID, SEX);
run;`,

  exampleR: `library(dplyr)

adsl <- data.frame(
  USUBJID="101-001",
  SEX="M"
)

adsl <- adsl %>%
  mutate(IDSEX = paste0(USUBJID, SEX))`,

  outputTable: `
USUBJID   SEX   IDSEX
101-001   M     101-001M
`
},
{
  id: "catx-paste",
  category: "Character Functions",
  title: "CATX | paste",
  overview:
    "Concatenates two or more character strings and inserts a specified delimiter.",
  sas: "catx('/', var1, var2)",
  r: "paste(var1, var2, sep='/')",
  behavior:
    "CATX automatically strips leading/trailing blanks before concatenation. paste does not remove blanks unless trimmed.",
  details:
    "Commonly used to create combined display variables such as AGE/SEX or formatted visit labels.",

  exampleSAS: `data adsl;
  input USUBJID $ AGE SEX $;
datalines;
101-001 45 M
;
run;

data adsl2;
  set adsl;
  ASR = catx("/", AGE, SEX);
run;`,

  exampleR: `library(dplyr)

adsl <- data.frame(
  USUBJID="101-001",
  AGE=45,
  SEX="M"
)

adsl <- adsl %>%
  mutate(ASR = paste(AGE, SEX, sep="/"))`,

  outputTable: `
USUBJID   AGE   SEX   ASR
101-001   45    M     45/M
`
},
{
  id: "compress-gsub",
  category: "Character Functions",
  title: "COMPRESS | gsub (All Variants)",
  overview:
    "Removes specified characters or retains selected character classes using modifiers.",
  sas: `
compress(var)
compress(var,,"ka")
compress(var,,"kd")
compress(var,,"kp")
compress(var,,"kw")
compress(var,"@#","ka")
`,
  r: `
gsub(" ", "", var)
gsub("[^A-Za-z]", "", var)
gsub("[^0-9]", "", var)
gsub("[^[:punct:]]", "", var)
gsub("[^[:print:]]", "", var)
gsub("[^A-Za-z@#]", "", var)
`,
  behavior:
    "SAS uses modifiers (ka=keep alpha, kd=keep digits, kp=keep punctuation, kw=keep printable). R uses regular expressions for similar behavior.",
  details:
    "Commonly used to extract numeric or alphabetic portions from mixed character lab results.",

  exampleSAS: `data adlb;
  input USUBJID $ RESULT $;
datalines;
SUBJ001 45mg
SUBJ002 ALT@123#
;
run;

data adlb2;
  set adlb;
  KEEP_NUM = compress(RESULT,,'kd');
run;`,

  exampleR: `library(dplyr)

adlb <- data.frame(
  USUBJID=c("SUBJ001","SUBJ002"),
  RESULT=c("45mg","ALT@123#")
)

adlb <- adlb %>%
  mutate(KEEP_NUM = gsub("[^0-9]", "", RESULT))`,

  outputTable: `
USUBJID   RESULT      KEEP_NUM
SUBJ001   45mg        45
SUBJ002   ALT@123#    123
`
},
{
  id: "length-nchar",
  category: "Character Functions",
  title: "LENGTH | nchar",
  overview:
    "Returns the number of characters in a string.",
  sas: "length(var)",
  r: "nchar(var)",
  behavior:
    "SAS LENGTH returns length of character string excluding trailing blanks. R nchar counts characters exactly.",
  details:
    "Used during date imputation or validation to check length of partial ISO dates.",

  exampleSAS: `data adae;
  input USUBJID $ AESTDTC $;
datalines;
SUBJ001 2024-01
;
run;

data adae2;
  set adae;
  LEN = length(AESTDTC);
run;`,

  exampleR: `library(dplyr)

adae <- data.frame(
  USUBJID="SUBJ001",
  AESTDTC="2024-01"
)

adae <- adae %>%
  mutate(LEN = nchar(AESTDTC))`,

  outputTable: `
USUBJID   AESTDTC   LEN
SUBJ001   2024-01   7
`
},
{
  id: "index-grepl",
  category: "Character Functions",
  title: "INDEX | grepl",
  overview:
    "Searches for a substring within a character string and returns its position (or logical detection in R).",
  sas: "index(var, 'string')",
  r: "grepl('string', var)",
  behavior:
    "SAS INDEX returns numeric position (0 if not found). R grepl returns TRUE/FALSE logical value.",
  details:
    "Used to detect keywords in text variables to create flags (e.g., detecting GLUCOSE in PARAM).",

  exampleSAS: `data adlb;
  input USUBJID $ PARAM $;
datalines;
SUBJ001 GLUCOSE FASTING
;
run;

data adlb2;
  set adlb;
  if index(upcase(PARAM), "GLUCOSE") > 0 then GLUCFL = "Y";
run;`,

  exampleR: `library(dplyr)

adlb <- data.frame(
  USUBJID="SUBJ001",
  PARAM="GLUCOSE FASTING"
)

adlb <- adlb %>%
  mutate(GLUCFL = ifelse(grepl("GLUCOSE", toupper(PARAM)), "Y", "N"))`,

  outputTable: `
USUBJID   PARAM               GLUCFL
SUBJ001   GLUCOSE FASTING     Y
`
},
{
  id: "substr-strsub",
  category: "Character Functions",
  title: "SUBSTR | substr / str_sub",
  overview:
    "Extracts a portion of a character string beginning at a specified position.",
  sas: "substr(var, start, length)",
  r: "substr(var, start, stop)",
  behavior:
    "SAS uses length as third argument. R uses ending position. End position in R = start + length - 1.",
  details:
    "Commonly used to extract date portion from ISO 8601 datetime values.",

  exampleSAS: `data adae;
  input USUBJID $ EGDTC $20.;
datalines;
SUBJ001 2024-01-15T10:00:00
;
run;

data adae2;
  set adae;
  ADT = input(substr(EGDTC, 1, 10), is8601da.);
run;`,

  exampleR: `library(dplyr)

adae <- data.frame(
  USUBJID="SUBJ001",
  EGDTC="2024-01-15T10:00:00"
)

adae <- adae %>%
  mutate(ADT = as.Date(substr(EGDTC, 1, 10)))`,

  outputTable: `
USUBJID   EGDTC                   ADT
SUBJ001   2024-01-15T10:00:00     2024-01-15
`
},
{
  id: "scan-word",
  category: "Character Functions",
  title: "SCAN | word",
  overview:
    "Extracts the nth word from a character string based on specified delimiters.",
  sas: "scan(var, n, delimiter)",
  r: "stringr::word(var, n, sep=delimiter)",
  behavior:
    "SAS SCAN allows flexible delimiter specification. R word() requires explicit separator.",
  details:
    "Used to parse structured text fields such as category and term from raw values.",

  exampleSAS: `data adae;
  input USUBJID $ RAWTERM $40.;
datalines;
SUBJ001 AESI: HEADACHE SEVERE
;
run;

data adae2;
  set adae;
  AECAT = scan(RAWTERM,1,":");
run;`,

  exampleR: `library(dplyr)
library(stringr)

adae <- data.frame(
  USUBJID="SUBJ001",
  RAWTERM="AESI: HEADACHE SEVERE"
)

adae <- adae %>%
  mutate(AECAT = word(RAWTERM, 1, sep=":"))`,

  outputTable: `
USUBJID   RAWTERM                   AECAT
SUBJ001   AESI: HEADACHE SEVERE     AESI
`
},
{
  id: "translate-chartr",
  category: "Character Functions",
  title: "TRANSLATE | chartr",
  overview:
    "Replaces individual characters in a string based on positional mapping.",
  sas: "translate(var,'to','from')",
  r: "chartr('from','to',var)",
  behavior:
    "Both perform character-by-character replacement. Length of 'to' and 'from' must match.",
  details:
    "Used to standardize inconsistent delimiters or symbols in raw text fields.",

  exampleSAS: `data dm;
  input USUBJID $ SITE $;
datalines;
SUBJ001 week_12
;
run;

data dm2;
  set dm;
  SITE_STD = translate(SITE,'-','_');
run;`,

  exampleR: `library(dplyr)

dm <- data.frame(
  USUBJID="SUBJ001",
  SITE="week_12"
)

dm <- dm %>%
  mutate(SITE_STD = chartr("_","-",SITE))`,

  outputTable: `
USUBJID   SITE      SITE_STD
SUBJ001   week_12   week-12
`
},
{
  id: "tranwrd-strreplace",
  category: "Character Functions",
  title: "TRANWRD | str_replace_all",
  overview:
    "Replaces all occurrences of a specified substring within a character string.",
  sas: "tranwrd(var,'from','to')",
  r: "stringr::str_replace_all(var,'from','to')",
  behavior:
    "SAS replaces all occurrences automatically. R requires str_replace_all from stringr.",
  details:
    "Used to standardize words or phrases in SDTM and ADaM datasets.",

  exampleSAS: `data lb;
  input USUBJID $ VISIT $;
datalines;
SUBJ001 week_12
;
run;

data lb2;
  set lb;
  VISIT_STD = tranwrd(VISIT,'week','wk');
run;`,

  exampleR: `library(dplyr)
library(stringr)

lb <- data.frame(
  USUBJID="SUBJ001",
  VISIT="week_12"
)

lb <- lb %>%
  mutate(VISIT_STD = str_replace_all(VISIT,"week","wk"))`,

  outputTable: `
USUBJID   VISIT     VISIT_STD
SUBJ001   week_12   wk_12
`
},
{
  id: "upcase-toupper",
  category: "Character Functions",
  title: "UPCASE | toupper",
  overview:
    "Converts all alphabetic characters in a string to uppercase.",
  sas: "upcase(var)",
  r: "toupper(var)",
  behavior:
    "Behavior is the same in both SAS and R.",
  details:
    "Used to standardize values for comparisons, controlled terminology checks, and CDISC compliance.",

  exampleSAS: `data lb;
  input USUBJID $ LBTESTCD $;
datalines;
SUBJ001 alt
;
run;

data lb2;
  set lb;
  LBTESTCD_STD = upcase(LBTESTCD);
run;`,

  exampleR: `library(dplyr)

lb <- data.frame(
  USUBJID="SUBJ001",
  LBTESTCD="alt"
)

lb <- lb %>%
  mutate(LBTESTCD_STD = toupper(LBTESTCD))`,

  outputTable: `
USUBJID   LBTESTCD   LBTESTCD_STD
SUBJ001   alt        ALT
`
},
{
  id: "lowcase-tolower",
  category: "Character Functions",
  title: "LOWCASE | tolower",
  overview:
    "Converts all alphabetic characters in a string to lowercase.",
  sas: "lowcase(var)",
  r: "tolower(var)",
  behavior:
    "Behavior is the same in both SAS and R.",
  details:
    "Used when case standardization is required in SDTM or ADaM datasets.",

  exampleSAS: `data cm;
  input USUBJID $ CMROUTE $;
datalines;
SUBJ001 ORAL
;
run;

data cm2;
  set cm;
  CMROUTE_STD = lowcase(CMROUTE);
run;`,

  exampleR: `library(dplyr)

cm <- data.frame(
  USUBJID="SUBJ001",
  CMROUTE="ORAL"
)

cm <- cm %>%
  mutate(CMROUTE_STD = tolower(CMROUTE))`,

  outputTable: `
USUBJID   CMROUTE   CMROUTE_STD
SUBJ001   ORAL      oral
`
},
{
  id: "propcase-strtotitle",
  category: "Character Functions",
  title: "PROPCASE | str_to_title",
  overview:
    "Converts a character string to proper case by capitalizing the first letter of each word.",
  sas: "propcase(var)",
  r: "stringr::str_to_title(var)",
  behavior:
    "SAS PROPCASE automatically capitalizes first letter of each word. R requires stringr package.",
  details:
    "Used to standardize display values such as TEST or PARAM names in reports.",

  exampleSAS: `data adsl;
  input USUBJID $ NAME $;
datalines;
SUBJ001 john doe
;
run;

data adsl2;
  set adsl;
  NAME_STD = propcase(NAME);
run;`,

  exampleR: `library(dplyr)
library(stringr)

adsl <- data.frame(
  USUBJID="SUBJ001",
  NAME="john doe"
)

adsl <- adsl %>%
  mutate(NAME_STD = str_to_title(NAME))`,

  outputTable: `
USUBJID   NAME        NAME_STD
SUBJ001   john doe    John Doe
`
},
{
  id: "compbl-gsub",
  category: "Character Functions",
  title: "COMPBL | gsub (Reduce Blanks)",
  overview:
    "Reduces multiple consecutive blanks within a character string to a single blank.",
  sas: "compbl(var)",
  r: "gsub(' +',' ',var)",
  behavior:
    "SAS COMPBL automatically compresses multiple blanks. R uses regular expression to achieve similar result.",
  details:
    "Commonly applied to free-text variables to standardize spacing before reporting.",

  exampleSAS: `data co;
  input USUBJID $ COVAL $40.;
datalines;
SUBJ001 Severe    headache
;
run;

data co2;
  set co;
  COVAL_STD = compbl(COVAL);
run;`,

  exampleR: `library(dplyr)

co <- data.frame(
  USUBJID="SUBJ001",
  COVAL="Severe    headache"
)

co <- co %>%
  mutate(COVAL_STD = gsub(" +"," ",COVAL))`,

  outputTable: `
USUBJID   COVAL               COVAL_STD
SUBJ001   Severe    headache  Severe headache
`
},
{
  id: "cmiss-rowsums",
  category: "Character Functions",
  title: "CMISS | rowSums(is.na())",
  overview:
    "Returns the number of missing values across a list of variables (character or numeric).",
  sas: "cmiss(var1,var2)",
  r: "rowSums(is.na(data.frame(var1,var2)))",
  behavior:
    "SAS CMISS counts missing values across variables directly. R requires combining variables and applying is.na() with rowSums().",
  details:
    "Used in conditional derivations to ensure completeness before calculations in SDTM and ADaM datasets.",

  exampleSAS: `data adsl;
  input USUBJID $ AGE SEX $;
datalines;
SUBJ001 45 M
SUBJ002 .  F
;
run;

data adsl2;
  set adsl;
  if cmiss(AGE,SEX)=0 then COMPLETEFL="Y";
  else COMPLETEFL="N";
run;`,

  exampleR: `library(dplyr)

adsl <- data.frame(
  USUBJID=c("SUBJ001","SUBJ002"),
  AGE=c(45,NA),
  SEX=c("M","F")
)

adsl <- adsl %>%
  mutate(
    MISS_COUNT = rowSums(is.na(data.frame(AGE,SEX))),
    COMPLETEFL = ifelse(MISS_COUNT==0,"Y","N")
  )`,

  outputTable: `
USUBJID   AGE   SEX   COMPLETEFL
SUBJ001   45    M     Y
SUBJ002   NA    F     N
`
},
{
  id: "mean-mean",
  category: "Numeric Functions",
  title: "MEAN | mean",
  overview:
    "Calculates the arithmetic mean of numeric values.",
  sas: "mean(AVAL)",
  r: "mean(AVAL, na.rm=TRUE)",
  behavior:
    "SAS MEAN automatically ignores missing values. R requires na.rm=TRUE to remove NA values.",
  details:
    "Used to derive mean change from baseline in ADLB for TFL summaries.",

  exampleSAS: `proc means data=adlb mean;
  var AVAL;
run;`,

  exampleR: `library(dplyr)

adlb <- data.frame(
  USUBJID=c("SUBJ001","SUBJ002","SUBJ003","SUBJ004"),
  AVAL=c(10,12,NA,14)
)

adlb %>%
  summarise(MEAN_AVAL = mean(AVAL, na.rm=TRUE))`,

  outputTable: `
MEAN_AVAL
12
`
},
{
  id: "nmiss-sumisna",
  category: "Numeric Functions",
  title: "NMISS | sum(is.na())",
  overview:
    "Counts the number of missing numeric values.",
  sas: "nmiss(AVAL)",
  r: "sum(is.na(AVAL))",
  behavior:
    "SAS NMISS directly counts numeric missing values. R uses is.na() wrapped inside sum().",
  details:
    "Used to check completeness of AVAL before deriving summary statistics in ADaM datasets.",

  exampleSAS: `data adlb;
  input USUBJID $ AVAL;
datalines;
SUBJ001 10
SUBJ002 .
SUBJ003 15
;
run;

data adlb2;
  set adlb;
  MISS_COUNT = nmiss(AVAL);
run;`,

  exampleR: `library(dplyr)

adlb <- data.frame(
  USUBJID=c("SUBJ001","SUBJ002","SUBJ003"),
  AVAL=c(10,NA,15)
)

adlb <- adlb %>%
  mutate(MISS_COUNT = sum(is.na(AVAL)))`,

  outputTable: `
USUBJID   AVAL   MISS_COUNT
SUBJ001   10     1
SUBJ002   NA     1
SUBJ003   15     1
`
},
{
  id: "sum-sum",
  category: "Numeric Functions",
  title: "SUM | sum",
  overview:
    "Returns the total of numeric values.",
  sas: "sum(DOSE)",
  r: "sum(DOSE, na.rm=TRUE)",
  behavior:
    "SAS SUM ignores missing values automatically. R requires na.rm=TRUE.",
  details:
    "Used to calculate cumulative dose in ADEX or total event counts in ADAE.",

  exampleSAS: `data adex;
  input USUBJID $ DOSE;
datalines;
SUBJ001 100
SUBJ001 200
SUBJ001 .
;
run;

proc means data=adex sum;
  var DOSE;
run;`,

  exampleR: `library(dplyr)

adex <- data.frame(
  USUBJID=c("SUBJ001","SUBJ001","SUBJ001"),
  DOSE=c(100,200,NA)
)

adex %>%
  summarise(TOTAL_DOSE = sum(DOSE, na.rm=TRUE))`,

  outputTable: `
TOTAL_DOSE
300
`
},
{
  id: "std-sd",
  category: "Numeric Functions",
  title: "STD | sd",
  overview:
    "Calculates the standard deviation of numeric values.",
  sas: "std(AVAL)",
  r: "sd(AVAL, na.rm=TRUE)",
  behavior:
    "SAS STD ignores missing values automatically. R requires na.rm=TRUE.",
  details:
    "Used to report variability of lab values in safety TFL outputs.",

  exampleSAS: `proc means data=adlb std;
  var AVAL;
run;`,

  exampleR: `library(dplyr)

adlb <- data.frame(
  AVAL=c(10,12,14,NA)
)

adlb %>%
  summarise(SD_AVAL = sd(AVAL, na.rm=TRUE))`,

  outputTable: `
SD_AVAL
2
`
},
{
  id: "min-min",
  category: "Numeric Functions",
  title: "MIN | min",
  overview:
    "Returns the smallest value.",
  sas: "min(ADT)",
  r: "min(ADT, na.rm=TRUE)",
  behavior:
    "SAS MIN ignores missing automatically. R requires na.rm=TRUE.",
  details:
    "Used to identify earliest event date per subject in ADAE.",

  exampleSAS: `proc means data=adae min;
  var ADT;
run;`,

  exampleR: `library(dplyr)

adae <- data.frame(
  ADT=as.Date(c("2024-01-01","2024-02-01",NA))
)

adae %>%
  summarise(MIN_ADT = min(ADT, na.rm=TRUE))`,

  outputTable: `
MIN_ADT
2024-01-01
`
},
{
  id: "max-max",
  category: "Numeric Functions",
  title: "MAX | max",
  overview:
    "Returns the largest value.",
  sas: "max(ADT)",
  r: "max(ADT, na.rm=TRUE)",
  behavior:
    "SAS MAX ignores missing automatically. R requires na.rm=TRUE.",
  details:
    "Used to derive latest visit date or maximum post-baseline value in ADLB.",

  exampleSAS: `proc means data=adlb max;
  var ADT;
run;`,

  exampleR: `library(dplyr)

adlb <- data.frame(
  ADT=as.Date(c("2024-01-01","2024-02-01",NA))
)

adlb %>%
  summarise(MAX_ADT = max(ADT, na.rm=TRUE))`,

  outputTable: `
MAX_ADT
2024-02-01
`
},
{
  id: "round-round",
  category: "Numeric Functions",
  title: "ROUND | round",
  overview:
    "Rounds numeric values to a specified precision.",
  sas: "round(AVAL, 0.1)",
  r: "round(AVAL, 1)",
  behavior:
    "SAS uses rounding unit (e.g., 0.1). R uses number of decimal places (digits).",
  details:
    "Used to format analysis results for TFL display (e.g., mean to 1 decimal place).",

  exampleSAS: `data adlb;
  input USUBJID $ AVAL;
datalines;
SUBJ001 12.345
;
run;

data adlb2;
  set adlb;
  AVAL_R = round(AVAL, 0.1);
run;`,

  exampleR: `library(dplyr)

adlb <- data.frame(
  USUBJID="SUBJ001",
  AVAL=12.345
)

adlb <- adlb %>%
  mutate(AVAL_R = round(AVAL, 1))`,

  outputTable: `
USUBJID   AVAL     AVAL_R
SUBJ001   12.345   12.3
`
},
{
  id: "log-log",
  category: "Numeric Functions",
  title: "LOG | log",
  overview:
    "Computes the natural logarithm of a numeric value.",
  sas: "log(PKVAL)",
  r: "log(PKVAL)",
  behavior:
    "Behavior is the same. Both compute natural logarithm (base e).",
  details:
    "Used to log-transform PK concentrations prior to statistical modeling.",

  exampleSAS: `data pk;
  input USUBJID $ PKVAL;
datalines;
SUBJ001 50
;
run;

data pk2;
  set pk;
  LOGPK = log(PKVAL);
run;`,

  exampleR: `library(dplyr)

pk <- data.frame(
  USUBJID="SUBJ001",
  PKVAL=50
)

pk <- pk %>%
  mutate(LOGPK = log(PKVAL))`,

  outputTable: `
USUBJID   PKVAL   LOGPK
SUBJ001   50      3.912
`
},
{
  id: "day-day",
  category: "Numeric Functions",
  title: "DAY | lubridate::day",
  overview:
    "Extracts the day component from a date.",
  sas: "day(ADT)",
  r: "lubridate::day(ADT)",
  behavior:
    "SAS has built-in DAY function. R requires lubridate package.",
  details:
    "Used during partial date imputation in ADAE or ADLB datasets.",

  exampleSAS: `data adae;
  ADT = '01JAN2024'd;
  DAYVAL = day(ADT);
run;`,

  exampleR: `library(dplyr)
library(lubridate)

adae <- data.frame(
  ADT=as.Date("2024-01-01")
)

adae <- adae %>%
  mutate(DAYVAL = day(ADT))`,

  outputTable: `
ADT          DAYVAL
2024-01-01   1
`
},
{
  id: "month-month",
  category: "Numeric Functions",
  title: "MONTH | lubridate::month",
  overview:
    "Extracts the month component from a date.",
  sas: "month(ADT)",
  r: "lubridate::month(ADT)",
  behavior:
    "SAS has built-in MONTH function. R requires lubridate package.",
  details:
    "Used during partial date imputation and handling incomplete ISO dates.",

  exampleSAS: `data adae;
  ADT = '01JAN2024'd;
  MONVAL = month(ADT);
run;`,

  exampleR: `library(dplyr)
library(lubridate)

adae <- data.frame(
  ADT=as.Date("2024-01-01")
)

adae <- adae %>%
  mutate(MONVAL = month(ADT))`,

  outputTable: `
ADT          MONVAL
2024-01-01   1
`
},
{
  id: "year-year",
  category: "Numeric Functions",
  title: "YEAR | lubridate::year",
  overview:
    "Extracts the year component from a date.",
  sas: "year(ADT)",
  r: "lubridate::year(ADT)",
  behavior:
    "SAS has built-in YEAR function. R requires lubridate package.",
  details:
    "Used to derive analysis year for exposure summaries and yearly reports.",

  exampleSAS: `data adex;
  ADT = '01JAN2024'd;
  YR = year(ADT);
run;`,

  exampleR: `library(dplyr)
library(lubridate)

adex <- data.frame(
  ADT=as.Date("2024-01-01")
)

adex <- adex %>%
  mutate(YR = year(ADT))`,

  outputTable: `
ADT          YR
2024-01-01   2024
`
},
{
  id: "int-asinteger",
  category: "Numeric Functions",
  title: "INT | as.integer",
  overview:
    "Converts numeric value to integer by truncation.",
  sas: "int(DY)",
  r: "as.integer(DY)",
  behavior:
    "Both truncate decimals toward zero (no rounding).",
  details:
    "Used when converting day differences to integer values in ADaM derivations.",

  exampleSAS: `data adsl;
  input USUBJID $ DY;
datalines;
SUBJ001 12.8
;
run;

data adsl2;
  set adsl;
  DY_INT = int(DY);
run;`,

  exampleR: `library(dplyr)

adsl <- data.frame(
  USUBJID="SUBJ001",
  DY=12.8
)

adsl <- adsl %>%
  mutate(DY_INT = as.integer(DY))`,

  outputTable: `
USUBJID   DY     DY_INT
SUBJ001   12.8   12
`
},
{
  id: "ceil-ceiling",
  category: "Numeric Functions",
  title: "CEIL | ceiling",
  overview:
    "Rounds a numeric value up to the nearest integer.",
  sas: "ceil(DUR)",
  r: "ceiling(DUR)",
  behavior:
    "Behavior is the same in SAS and R. Both round upward to the next integer.",
  details:
    "Used to round exposure duration upward when reporting treatment duration or cycle counts.",

  exampleSAS: `data adex;
  input USUBJID $ DUR;
datalines;
SUBJ001 4.2
;
run;

data adex2;
  set adex;
  DUR_UP = ceil(DUR);
run;`,

  exampleR: `library(dplyr)

adex <- data.frame(
  USUBJID="SUBJ001",
  DUR=4.2
)

adex <- adex %>%
  mutate(DUR_UP = ceiling(DUR))`,

  outputTable: `
USUBJID   DUR   DUR_UP
SUBJ001   4.2   5
`
},
{
  id: "floor-floor",
  category: "Numeric Functions",
  title: "FLOOR | floor",
  overview:
    "Rounds a numeric value down to the nearest integer.",
  sas: "floor(DUR)",
  r: "floor(DUR)",
  behavior:
    "Behavior is the same in SAS and R. Both round downward to the previous integer.",
  details:
    "Used to calculate completed treatment weeks or full exposure cycles in clinical analyses.",

  exampleSAS: `data adex;
  input USUBJID $ DUR;
datalines;
SUBJ001 4.8
;
run;

data adex2;
  set adex;
  DUR_LOW = floor(DUR);
run;`,

  exampleR: `library(dplyr)

adex <- data.frame(
  USUBJID="SUBJ001",
  DUR=4.8
)

adex <- adex %>%
  mutate(DUR_LOW = floor(DUR))`,

  outputTable: `
USUBJID   DUR   DUR_LOW
SUBJ001   4.8   4
`
},
{
  id: "is8601da",
  category: "Date Formats",
  title: "IS8601DA. | as.Date (ISO YYYY-MM-DD)",
  overview:
    "Reads ISO 8601 date format (YYYY-MM-DD).",
  sas: "input(DTC, is8601da.)",
  r: "as.Date(DTC)",
  behavior:
    "SAS uses IS8601DA. informat. R automatically parses ISO format using as.Date without explicit format.",
  details:
    "Used for converting SDTM --DTC to ADaM ADT.",

  exampleSAS: `data iso_da;
  input USUBJID $ DTC $10.;
datalines;
SUBJ001 2020-01-01
;
run;

data iso_da2;
  set iso_da;
  ADT = input(DTC, is8601da.);
run;`,

  exampleR: `library(dplyr)

iso_da <- data.frame(
  USUBJID="SUBJ001",
  DTC="2020-01-01"
)

iso_da <- iso_da %>%
  mutate(ADT = as.Date(DTC))`,

  outputTable: `
USUBJID   DTC           ADT
SUBJ001   2020-01-01    2020-01-01
`
},
{
  id: "date9",
  category: "Date Formats",
  title: "DATE9. | as.Date(format='%d%b%Y')",
  overview:
    "Reads date format like 01JAN2020.",
  sas: "input(DTC, date9.)",
  r: "as.Date(DTC, format='%d%b%Y')",
  behavior:
    "SAS DATE9. reads automatically. R requires explicit format specification.",
  details:
    "Common in legacy raw datasets.",

  exampleSAS: `data date9_ex;
  input USUBJID $ DTC $9.;
datalines;
SUBJ001 01JAN2020
;
run;

data date9_ex2;
  set date9_ex;
  ADT = input(DTC, date9.);
run;`,

  exampleR: `library(dplyr)

date9_ex <- data.frame(
  USUBJID="SUBJ001",
  DTC="01JAN2020"
)

date9_ex <- date9_ex %>%
  mutate(ADT = as.Date(DTC, format="%d%b%Y"))`,

  outputTable: `
USUBJID   DTC         ADT
SUBJ001   01JAN2020   2020-01-01
`
},
{
  id: "ddmmyy10",
  category: "Date Formats",
  title: "DDMMYY10. | as.Date(format='%d-%m-%Y')",
  overview:
    "Reads date format like 01-01-2020.",
  sas: "input(DTC, ddmmyy10.)",
  r: "as.Date(DTC, format='%d-%m-%Y')",
  behavior:
    "Both read properly when correct format is specified in R.",
  details:
    "Used in non-ISO raw datasets.",

  exampleSAS: `data ddmmyy_ex;
  input USUBJID $ DTC $10.;
datalines;
SUBJ001 01-01-2020
;
run;

data ddmmyy_ex2;
  set ddmmyy_ex;
  ADT = input(DTC, ddmmyy10.);
run;`,

  exampleR: `library(dplyr)

ddmmyy_ex <- data.frame(
  USUBJID="SUBJ001",
  DTC="01-01-2020"
)

ddmmyy_ex <- ddmmyy_ex %>%
  mutate(ADT = as.Date(DTC, format="%d-%m-%Y"))`,

  outputTable: `
USUBJID   DTC          ADT
SUBJ001   01-01-2020   2020-01-01
`
},
{
  id: "is8601dt",
  category: "Date Formats",
  title: "IS8601DT. | as.POSIXct (ISO Datetime)",
  overview:
    "Reads ISO 8601 datetime format.",
  sas: "input(DTC, is8601dt.)",
  r: "as.POSIXct(DTC, format='%Y-%m-%dT%H:%M:%S')",
  behavior:
    "SAS informat handles automatically. R requires explicit datetime format.",
  details:
    "Used to convert SDTM datetime to ADTM.",

  exampleSAS: `data iso_dt_ex;
  input USUBJID $ DTC $20.;
datalines;
SUBJ001 2020-01-01T10:00:00
;
run;

data iso_dt_ex2;
  set iso_dt_ex;
  ADTM = input(DTC, is8601dt.);
run;`,

  exampleR: `library(dplyr)

iso_dt_ex <- data.frame(
  USUBJID="SUBJ001",
  DTC="2020-01-01T10:00:00"
)

iso_dt_ex <- iso_dt_ex %>%
  mutate(ADTM = as.POSIXct(DTC,
         format="%Y-%m-%dT%H:%M:%S"))`,

  outputTable: `
USUBJID   ADTM
SUBJ001   2020-01-01 10:00:00
`
},
{
  id: "datetime19",
  category: "Date Formats",
  title: "DATETIME19. | as.POSIXct(format='%d%b%Y:%H:%M:%S')",
  overview:
    "Reads datetime format like 01JAN2020:10:00:00.",
  sas: "input(DTC, datetime19.)",
  r: "as.POSIXct(DTC, format='%d%b%Y:%H:%M:%S')",
  behavior:
    "SAS DATETIME19. reads automatically. R requires explicit format specification.",
  details:
    "Common in legacy datetime raw datasets.",

  exampleSAS: `data datetime19_ex;
  input USUBJID $ DTC $20.;
datalines;
SUBJ001 01JAN2020:10:00:00
;
run;

data datetime19_ex2;
  set datetime19_ex;
  ADTM = input(DTC, datetime19.);
run;`,

  exampleR: `library(dplyr)

datetime19_ex <- data.frame(
  USUBJID="SUBJ001",
  DTC="01JAN2020:10:00:00"
)

datetime19_ex <- datetime19_ex %>%
  mutate(ADTM = as.POSIXct(DTC,
         format="%d%b%Y:%H:%M:%S"))`,

  outputTable: `
USUBJID   ADTM
SUBJ001   2020-01-01 10:00:00
`
},
{
  id: "time5",
  category: "Date Formats",
  title: "TIME5. | strptime(format='%H:%M')",
  overview:
    "Reads time format HH:MM.",
  sas: "input(TMC, time5.)",
  r: "strptime(TMC, format='%H:%M')",
  behavior:
    "Both parse HH:MM format correctly when format is specified in R.",
  details:
    "Used when deriving analysis time variables from SDTM time strings.",

  exampleSAS: `data time5_ex;
  input USUBJID $ TMC $5.;
datalines;
SUBJ001 10:00
;
run;

data time5_ex2;
  set time5_ex;
  TM = input(TMC, time5.);
run;`,

  exampleR: `time5_ex <- data.frame(
  USUBJID="SUBJ001",
  TMC="10:00"
)

time5_ex$TM <- strptime(time5_ex$TMC,
                        format="%H:%M")`,

  outputTable: `
USUBJID   TM
SUBJ001   10:00
`
},
{
  id: "is8601tm",
  category: "Date Formats",
  title: "IS8601TM. | strptime(format='%H:%M:%S')",
  overview:
    "Reads time format HH:MM:SS.",
  sas: "input(TMC, is8601tm.)",
  r: "strptime(TMC, format='%H:%M:%S')",
  behavior:
    "SAS informat handles automatically. R requires explicit format.",
  details:
    "Used when SDTM time variables need conversion to analysis-ready format.",

  exampleSAS: `data iso_tm_ex;
  input USUBJID $ TMC $8.;
datalines;
SUBJ001 10:00:00
;
run;

data iso_tm_ex2;
  set iso_tm_ex;
  TM = input(TMC, is8601tm.);
run;`,

  exampleR: `iso_tm_ex <- data.frame(
  USUBJID="SUBJ001",
  TMC="10:00:00"
)

iso_tm_ex$TM <- strptime(iso_tm_ex$TMC,
                         format="%H:%M:%S")`,

  outputTable: `
USUBJID   TM
SUBJ001   10:00:00
`
}
];