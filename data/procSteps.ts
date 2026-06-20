// data/procSteps.ts

export type ProcStepItem = {
  id: string;
  title: string;
  category: "PROC Steps";
  overview: string;
  behavior?: string;
  sas: string;
  r: string;
  details: string;

  // ── Example 1 ──
  example1Title?: string;
  example1Desc?: string;
  example1Input?: string;
  exampleSAS: string;
  exampleR: string;
  outputTable1?: string;
  outputNote1?: string;

  // ── Example 2 ──
  example2Title?: string;
  example2Desc?: string;
  example2Input?: string;
  example2SAS?: string;
  example2R?: string;
  outputTable2?: string;
  outputNote2?: string;

  // ── Example 3 ──
  example3Title?: string;
  example3Desc?: string;
  example3Input?: string;
  example3SAS?: string;
  example3R?: string;
  outputTable3?: string;
  outputNote3?: string;

  // ── Example 4 ──
  example4Title?: string;
  example4Desc?: string;
  example4Input?: string;
  example4SAS?: string;
  example4R?: string;
  outputTable4?: string;
  outputNote4?: string;

  // ── Watch Out ──
  watchOut?: string;

  // ── Conclusion ──
  conclusion?: string;
};

export const procStepsData: ProcStepItem[] = [

  // ════════════════════════════════════════════════════════════
  // PROC SORT
  // ════════════════════════════════════════════════════════════
  {
    id: "proc-sort",
    category: "PROC Steps",
    title: "PROC SORT",

    overview:
      "PROC SORT arranges the observations in a SAS dataset by one or more variables. " +
      "It must be run before any BY-group processing in a DATA step or other PROC. " +
      "When no OUT= option is specified, PROC SORT modifies the dataset in-place. " +
      "In R, the equivalent is dplyr::arrange() — which always returns a new object " +
      "and never modifies the original dataset.",

    behavior:
      "In SAS, PROC SORT physically reorders the observations in the dataset. " +
      "Sorting is required before any BY statement in a DATA step or PROC — " +
      "otherwise SAS will produce an error or unexpected results. " +
      "By default, SAS sorts ascending. Use the DESCENDING keyword before a variable name to reverse order. " +
      "NODUPKEY removes rows with duplicate BY-variable values, keeping the first occurrence. " +
      "NODUP removes rows where every column is identical. " +
      "In R, arrange() from dplyr sorts without modifying the original — " +
      "the result must always be assigned. " +
      "desc() inside arrange() reverses the sort order for a specific variable. " +
      "distinct() replicates NODUPKEY and NODUP behaviour depending on arguments passed.",

    sas: `/* Basic ascending sort */
proc sort data=ADSL;
  by USUBJID;
run;

/* Multi-variable sort */
proc sort data=ADLB;
  by USUBJID LBTESTCD VISITNUM;
run;

/* Descending sort */
proc sort data=ADSL;
  by descending AGE;
run;

/* Mixed — ascending TRT, descending AVAL */
proc sort data=ADLB;
  by TRT01P descending AVAL;
run;`,

    r: `library(dplyr)

# Basic ascending sort
ADSL <- ADSL |> arrange(USUBJID)

# Multi-variable sort
ADLB <- ADLB |> arrange(USUBJID, LBTESTCD, VISITNUM)

# Descending sort
ADSL <- ADSL |> arrange(desc(AGE))

# Mixed — ascending TRT, descending AVAL
ADLB <- ADLB |> arrange(TRT01P, desc(AVAL))`,

    details:
      "PROC SORT is one of the most frequently used procedures in SAS clinical programming. " +
      "It is required before any BY-group processing — including DATA step merges, " +
      "FIRST./LAST. logic, PROC MEANS with CLASS, and PROC FREQ with BY. " +
      "In R, arrange() is lazy — it returns a sorted copy without touching the original. " +
      "Always reassign the result back to the dataset name, or to a new name if you need both versions. " +
      "The pipe operator |> (or %>%) allows chaining arrange() with other dplyr verbs in one step.",

    // ── Example 1 ─────────────────────────────────────────────
    example1Title: "Example 1 — Basic Sort and Multi-Variable Sort",
    example1Desc:
      "Sort ADSL by USUBJID (ascending) — the most common sort used before a DATA step merge. " +
      "Then sort ADLB by USUBJID, LBTESTCD and VISITNUM to prepare for BY-group processing " +
      "that will derive BASE and CHG per subject and lab test.",

    example1Input: `
── Input Dataset: ADSL (unsorted) ─────────────────

USUBJID       AGE    SEX    TRT01P
CDISC003      38     F      Drug A
CDISC001      45     M      Placebo
CDISC004      61     F      Drug A
CDISC002      52     M      Placebo


── Input Dataset: ADLB (unsorted) ─────────────────

USUBJID       LBTESTCD    VISITNUM    AVAL
CDISC002      ALT         2           35
CDISC001      CREAT       1           0.9
CDISC001      ALT         2           30
CDISC002      CREAT       1           1.0
CDISC001      ALT         1           25
CDISC002      ALT         1           28
`,

    exampleSAS: `/* Sort ADSL by USUBJID */
proc sort data=ADSL;
  by USUBJID;
run;

/* Sort ADLB by USUBJID, LBTESTCD, VISITNUM */
proc sort data=ADLB;
  by USUBJID LBTESTCD VISITNUM;
run;`,

    exampleR: `library(dplyr)

# Sort ADSL by USUBJID
ADSL <- ADSL |> arrange(USUBJID)

# Sort ADLB by USUBJID, LBTESTCD, VISITNUM
ADLB <- ADLB |> arrange(USUBJID, LBTESTCD, VISITNUM)`,

    outputTable1: `
── Output: ADSL sorted by USUBJID ─────────────────

USUBJID       AGE    SEX    TRT01P
CDISC001      45     M      Placebo
CDISC002      52     M      Placebo
CDISC003      38     F      Drug A
CDISC004      61     F      Drug A


── Output: ADLB sorted by USUBJID, LBTESTCD, VISITNUM

USUBJID       LBTESTCD    VISITNUM    AVAL
CDISC001      ALT         1           25
CDISC001      ALT         2           30
CDISC001      CREAT       1           0.9
CDISC002      ALT         1           28
CDISC002      ALT         2           35
CDISC002      CREAT       1           1.0
`,

    outputNote1:
      "ADSL is now in USUBJID order — ready for a DATA step merge with any other dataset sorted by USUBJID. " +
      "ADLB is sorted by USUBJID first, then LBTESTCD within each subject, then VISITNUM within each test. " +
      "This order is essential before any DATA step that uses FIRST.LBTESTCD or LAST.LBTESTCD " +
      "to detect group boundaries for deriving BASE and CHG. " +
      "The result is the same in both SAS and R.",

    // ── Example 2 ─────────────────────────────────────────────
    example2Title: "Example 2 — Descending Sort and Mixed Sort",
    example2Desc:
      "Sort ADSL by AGE descending to identify the oldest subjects first. " +
      "Then sort ADLB by TRT01P ascending and AVAL descending — " +
      "a mixed sort commonly used to rank lab values within each treatment group " +
      "for a top-N listing or shift table.",

    example2Input: `
── Input Dataset: ADSL ────────────────────────────

USUBJID       AGE    TRT01P
CDISC001      45     Placebo
CDISC002      52     Placebo
CDISC003      38     Drug A
CDISC004      61     Drug A
CDISC005      29     Drug A


── Input Dataset: ADLB ────────────────────────────

USUBJID       TRT01P     LBTESTCD    AVAL
CDISC001      Placebo    ALT         25
CDISC002      Placebo    ALT         55
CDISC003      Drug A     ALT         18
CDISC004      Drug A     ALT         72
CDISC005      Drug A     ALT         40
`,

    example2SAS: `/* Descending sort — oldest subjects first */
proc sort data=ADSL;
  by descending AGE;
run;

/* Mixed sort — TRT01P ascending, AVAL descending */
proc sort data=ADLB;
  by TRT01P descending AVAL;
run;`,

    example2R: `library(dplyr)

# Descending sort — oldest subjects first
ADSL <- ADSL |> arrange(desc(AGE))

# Mixed sort — TRT01P ascending, AVAL descending
ADLB <- ADLB |> arrange(TRT01P, desc(AVAL))`,

    outputTable2: `
── Output: ADSL sorted by AGE descending ──────────

USUBJID       AGE    TRT01P
CDISC004      61     Drug A
CDISC002      52     Placebo
CDISC001      45     Placebo
CDISC003      38     Drug A
CDISC005      29     Drug A


── Output: ADLB sorted by TRT01P asc, AVAL desc ───

USUBJID       TRT01P     LBTESTCD    AVAL
CDISC004      Drug A     ALT         72
CDISC005      Drug A     ALT         40
CDISC003      Drug A     ALT         18
CDISC002      Placebo    ALT         55
CDISC001      Placebo    ALT         25
`,

    outputNote2:
      "ADSL is now sorted from oldest to youngest — CDISC004 (age 61) appears first. " +
      "ADLB is sorted by TRT01P alphabetically (Drug A before Placebo), " +
      "then within each treatment group the highest AVAL appears first. " +
      "This ordering is useful for generating ranked lab listings or identifying subjects " +
      "with the most extreme values within each treatment arm. " +
      "In SAS, DESCENDING is placed before each variable that needs descending order. " +
      "In R, each variable is wrapped individually in desc(). " +
      "The result is the same in both SAS and R.",

    // ── Example 3 ─────────────────────────────────────────────
    example3Title: "Example 3 — NODUPKEY and NODUP",
    example3Desc:
      "NODUPKEY removes rows with duplicate BY-variable values — keeping only the first occurrence. " +
      "This is commonly used to deduplicate ADSL to one record per subject, " +
      "or to get one record per subject per visit. " +
      "NODUP removes rows where every single column is identical — a stricter check. " +
      "Both are demonstrated below with clinical dataset examples.",

    example3Input: `
── Input Dataset: ADSL with duplicate USUBJIDs ────

USUBJID       AGE    TRT01P     SITEID
CDISC001      45     Drug A     001
CDISC001      45     Drug A     001    ← exact duplicate
CDISC002      52     Placebo    002
CDISC003      38     Drug A     001
CDISC003      38     Drug A     003    ← same USUBJID, different SITEID


── Input Dataset: AE with exact duplicate rows ────

USUBJID       AESEQ    AETERM          AESTDTC
CDISC001      1        HEADACHE        2023-01-05
CDISC001      1        HEADACHE        2023-01-05    ← exact duplicate
CDISC002      1        NAUSEA          2023-02-03
CDISC002      2        DIZZINESS       2023-03-10
CDISC002      2        DIZZINESS       2023-03-10    ← exact duplicate
`,

    example3SAS: `/* NODUPKEY — keep first record per USUBJID */
proc sort data=ADSL nodupkey;
  by USUBJID;
run;

/* NODUP — remove only fully identical rows */
proc sort data=AE nodup;
  by USUBJID AESEQ;
run;`,

    example3R: `library(dplyr)

# NODUPKEY equivalent
# arrange first to control which row is kept
ADSL <- ADSL |>
  arrange(USUBJID) |>
  distinct(USUBJID, .keep_all = TRUE)

# NODUP equivalent — remove fully identical rows
AE <- AE |>
  distinct()`,

    outputTable3: `
── Output: ADSL after NODUPKEY ────────────────────

USUBJID       AGE    TRT01P     SITEID
CDISC001      45     Drug A     001    ← first kept, duplicate dropped
CDISC002      52     Placebo    002
CDISC003      38     Drug A     001    ← first kept (SITEID 003 row dropped)


── Output: AE after NODUP ─────────────────────────

USUBJID       AESEQ    AETERM          AESTDTC
CDISC001      1        HEADACHE        2023-01-05    ← exact dup removed
CDISC002      1        NAUSEA          2023-02-03
CDISC002      2        DIZZINESS       2023-03-10    ← exact dup removed
`,

    outputNote3:
      "NODUPKEY for ADSL: CDISC001 had two identical rows — the second is dropped. " +
      "CDISC003 had two rows with the same USUBJID but different SITEID — " +
      "NODUPKEY keeps only the first occurrence (SITEID 001) and drops SITEID 003 " +
      "because the BY variable USUBJID alone determines the duplicate, not other columns. " +
      "NODUP for AE: only rows where every single column matches are removed. " +
      "CDISC001 AESEQ=1 had an exact duplicate row — removed. " +
      "CDISC002 AESEQ=2 had an exact duplicate row — removed. " +
      "In R: distinct(USUBJID, .keep_all=TRUE) matches NODUPKEY. " +
      "distinct() with no arguments matches NODUP. " +
      "Always arrange() before distinct() in R to control which row is kept.",

    // ── Example 4 ─────────────────────────────────────────────
    example4Title: "Example 4 — OUT= and Sort Within Groups (Clinical Use)",
    example4Desc:
      "OUT= saves the sorted result to a new dataset without modifying the original — " +
      "equivalent to assigning to a new name in R. " +
      "Sort within groups is used to rank subjects within each treatment group " +
      "by lab value — a common step before FIRST./LAST. processing in a DATA step. " +
      "This example also shows the complete clinical pattern: " +
      "sort → DATA step FIRST./LAST. → derive per-subject flag.",

    example4Input: `
── Input Dataset: ADLB ────────────────────────────

USUBJID       TRT01P     LBTESTCD    VISITNUM    AVAL    ABLFL
CDISC003      Drug A     ALT         2           45
CDISC001      Placebo    ALT         1           25      Y
CDISC003      Drug A     ALT         1           30      Y
CDISC002      Placebo    ALT         2           55
CDISC004      Drug A     ALT         2           72
CDISC001      Placebo    ALT         2           38
CDISC004      Drug A     ALT         1           60      Y
CDISC002      Placebo    ALT         1           40      Y
`,

    example4SAS: `/* OUT= — save sorted copy, keep original intact */
proc sort data=ADLB out=ADLB_SORTED;
  by USUBJID LBTESTCD VISITNUM;
run;

/* Sort within groups — TRT01P asc, AVAL desc */
/* Used to rank subjects by lab value per treatment */
proc sort data=ADLB out=ADLB_RANKED;
  by TRT01P descending AVAL;
run;

/* Full clinical pattern — sort then FIRST./LAST. */
/* Derive BASEFL: flag baseline record per subject  */
proc sort data=ADLB out=ADLB_PREP;
  by USUBJID LBTESTCD VISITNUM;
run;

data ADLB_FINAL;
  set ADLB_PREP;
  by USUBJID LBTESTCD;
  if first.LBTESTCD then RANK = 0;
  RANK + 1;
run;`,

    example4R: `library(dplyr)

# OUT= equivalent — assign to new name
ADLB_SORTED <- ADLB |>
  arrange(USUBJID, LBTESTCD, VISITNUM)

# Sort within groups — TRT01P asc, AVAL desc
ADLB_RANKED <- ADLB |>
  arrange(TRT01P, desc(AVAL))

# Full clinical pattern — sort + rank within group
# Equivalent of sort + FIRST./LAST. DATA step
ADLB_FINAL <- ADLB |>
  arrange(USUBJID, LBTESTCD, VISITNUM) |>
  group_by(USUBJID, LBTESTCD) |>
  mutate(RANK = row_number()) |>
  ungroup()`,

    outputTable4: `
── Output: ADLB_SORTED (by USUBJID, LBTESTCD, VISITNUM)

USUBJID       TRT01P     LBTESTCD    VISITNUM    AVAL    ABLFL
CDISC001      Placebo    ALT         1           25      Y
CDISC001      Placebo    ALT         2           38
CDISC002      Placebo    ALT         1           40      Y
CDISC002      Placebo    ALT         2           55
CDISC003      Drug A     ALT         1           30      Y
CDISC003      Drug A     ALT         2           45
CDISC004      Drug A     ALT         1           60      Y
CDISC004      Drug A     ALT         2           72


── Output: ADLB_RANKED (TRT01P asc, AVAL desc) ────

USUBJID       TRT01P     LBTESTCD    VISITNUM    AVAL
CDISC004      Drug A     ALT         2           72
CDISC004      Drug A     ALT         1           60
CDISC003      Drug A     ALT         2           45
CDISC003      Drug A     ALT         1           30
CDISC002      Placebo    ALT         2           55
CDISC002      Placebo    ALT         1           40
CDISC001      Placebo    ALT         2           38
CDISC001      Placebo    ALT         1           25


── Output: ADLB_FINAL (with RANK within USUBJID+LBTESTCD)

USUBJID       TRT01P     LBTESTCD    VISITNUM    AVAL    ABLFL    RANK
CDISC001      Placebo    ALT         1           25      Y        1
CDISC001      Placebo    ALT         2           38               2
CDISC002      Placebo    ALT         1           40      Y        1
CDISC002      Placebo    ALT         2           55               2
CDISC003      Drug A     ALT         1           30      Y        1
CDISC003      Drug A     ALT         2           45               2
CDISC004      Drug A     ALT         1           60      Y        1
CDISC004      Drug A     ALT         2           72               2
`,

    outputNote4:
      "ADLB_SORTED: the original ADLB is unchanged — OUT= saves the sorted copy separately. " +
      "In R, assigning to a new name (ADLB_SORTED <-) is the direct equivalent of OUT=. " +
      "ADLB_RANKED: within Drug A, CDISC004 (AVAL=72) ranks first, CDISC003 (AVAL=30) last. " +
      "Within Placebo, CDISC002 (AVAL=55) ranks first, CDISC001 (AVAL=25) last. " +
      "ADLB_FINAL: RANK=1 marks the first visit per subject per lab test — " +
      "which is the baseline record (ABLFL=Y) when the data is sorted by VISITNUM. " +
      "In SAS, FIRST.LBTESTCD resets the counter at each new subject-test group. " +
      "In R, group_by(USUBJID, LBTESTCD) combined with row_number() achieves the same result. " +
      "Always call ungroup() after mutate() to avoid unexpected grouped behaviour downstream.",

    watchOut: "exists",

    conclusion:
      "Key Takeaway:\n" +
      "• PROC SORT must run before any BY-group processing in SAS — DATA step, PROC MEANS, PROC FREQ\n" +
      "• In R, arrange() never modifies the original — always reassign the result\n" +
      "• SAS uses DESCENDING keyword before the variable — R wraps it in desc()\n" +
      "• NODUPKEY → distinct(key_col, .keep_all = TRUE) — duplicates by key variable only\n" +
      "• NODUP → distinct() — duplicates only when every column is identical\n" +
      "• OUT= in SAS → assign to a new name in R to preserve the original\n" +
      "• FIRST./LAST. in DATA step requires a prior PROC SORT — in R use group_by() + row_number()\n" +
      "• Always arrange() before distinct() in R to control which row is kept",
  },
   {
  id: "proc-transpose",
  category: "PROC Steps",
  title: "PROC TRANSPOSE",

  overview:
    "PROC TRANSPOSE reshapes data from long to wide or wide to long. In R, the equivalent is pivot_wider() and pivot_longer() from tidyr.",

  behavior:
    "When PROC TRANSPOSE uses a BY statement, the input dataset must be sorted by the BY variables first. In R, pivot_wider() and pivot_longer() do not require sorting. PROC TRANSPOSE creates new columns based on ID values, while R explicitly uses names_from and values_from.",

  sas: `/* BY statement requires sorted data */
proc sort data=ADLB;
  by USUBJID;
run;

proc transpose data=ADLB out=ADLB_WIDE;
  by USUBJID;
  id LBTESTCD;
  var AVAL;
run;`,

  r: `library(dplyr)
library(tidyr)

ADLB_WIDE <- ADLB %>%
  pivot_wider(
    id_cols = USUBJID,
    names_from = LBTESTCD,
    values_from = AVAL
  )`,

  details:
    "PROC TRANSPOSE is commonly used in clinical programming to reshape laboratory, vital signs, ECG, or questionnaire data between long and wide formats.",

  // ── Example 1 ─────────────────────────────
  example1Title: "Example 1 — Long to Wide",

  example1Desc:
    "Convert lab rows into separate columns per subject.",

  example1Input: `
USUBJID    LBTESTCD    AVAL
CDISC001   ALT         45
CDISC001   AST         38
CDISC002   ALT         52
CDISC002   AST         40
`,

  exampleSAS: `/* BY statement requires sorted data */
proc sort data=ADLB;
  by USUBJID;
run;

proc transpose data=ADLB out=ADLB_WIDE;
  by USUBJID;
  id LBTESTCD;
  var AVAL;
run;`,

  exampleR: `library(tidyr)
library(dplyr)
  ADLB_WIDE <- ADLB %>%
  pivot_wider(
    id_cols = USUBJID,
    names_from = LBTESTCD,
    values_from = AVAL
  )`,

  outputTable1: `
USUBJID    ALT    AST
CDISC001   45     38
CDISC002   52     40
`,

  outputNote1:
    "Each LBTESTCD value becomes a separate column.",

  // ── Example 2 ─────────────────────────────
  example2Title: "Example 2 — Wide to Long",

  example2Desc:
    "Convert columns back into rows.",

  example2Input: `
USUBJID    ALT    AST
CDISC001   45     38
CDISC002   52     40
`,

  example2SAS: `/* BY statement requires sorted data */
proc sort data=ADLB_WIDE;
  by USUBJID;
run;

proc transpose data=ADLB_WIDE out=ADLB_LONG(
  rename=(_NAME_=LBTESTCD COL1=AVAL)
);
  by USUBJID;
  var AVAL;
run;`,

  example2R: `library(tidyr) 
library(dplyr) 
  ADLB_LONG <- ADLB_WIDE %>%
  pivot_longer(
    cols = c(ALT, AST),
    names_to = "LBTESTCD",
    values_to = "AVAL"
  )`,

  outputTable2: `
USUBJID    LBTESTCD    AVAL
CDISC001   ALT         45
CDISC001   AST         38
CDISC002   ALT         52
CDISC002   AST         40
`,

  outputNote2:
    "Wide columns become rows again.",

  watchOut:
    "PROC TRANSPOSE with a BY statement requires the input dataset to be sorted first. If the dataset is not sorted, SAS stops with an ERROR. In R, pivot_wider() and pivot_longer() do not require sorting, but explicit id_cols improves readability.",

  conclusion:
    "Key Takeaway:\n" +
    "• PROC TRANSPOSE reshapes rows and columns\n" +
    "• BY statement requires PROC SORT first in SAS\n" +
    "• pivot_wider() = long to wide\n" +
    "• pivot_longer() = wide to long\n" +
    "• id_cols in R is equivalent to BY variables in SAS\n" +
    "• Always define ID variables carefully",
},
{
  id: "proc-sql",
  category: "PROC Steps",
  title: "PROC SQL",

  overview:
    "PROC SQL is used in SAS to query, summarize, and manipulate datasets. In clinical programming, it is commonly used to derive counts, BIG N values, and summary datasets. In R, the equivalent operations are usually done using dplyr.",

  behavior:
    "PROC SQL can create summary tables, filter rows, count subjects, and store values into macro variables using INTO:. In R, similar logic is achieved using summarise(), n(), n_distinct(), and pull().",

  sas: `proc sql;
  select count(distinct USUBJID)
  into :BIGN
  from ADSL;
quit;`,

  r: `library(dplyr)

BIGN <- ADSL %>%
  summarise(n = n_distinct(USUBJID)) %>%
  pull(n)`,

  details:
    "PROC SQL is heavily used in TLF programming to derive counts and treatment totals. The INTO: clause stores results into macro variables, which are later used in titles, footnotes, and summary tables.",

  // ── Example 1 ─────────────────────────────
  example1Title: "Example 1 — Total Subject Count",

  example1Desc:
    "Count total number of subjects and store into macro variable BIGN.",

  example1Input: `
USUBJID    TRT01A
CDISC001   Placebo
CDISC002   Drug A
CDISC003   Drug A
`,

  exampleSAS: `proc sql noprint;
  select count(distinct USUBJID)
  into :BIGN
  from ADSL;
quit;`,

  exampleR: `library(dplyr)

BIGN <- ADSL %>%
  summarise(n = n_distinct(USUBJID)) %>%
  pull(n)`,

  outputTable1: `
BIGN = 3
`,

  outputNote1:
    "COUNT(DISTINCT USUBJID) returns total unique subjects.",

  // ── Example 2 ─────────────────────────────
  example2Title: "Example 2 — Treatment-wise Count",

  example2Desc:
    "Create treatment summary counts.",

  example2Input: `
USUBJID    TRT01A
CDISC001   Placebo
CDISC002   Drug A
CDISC003   Drug A
CDISC004   Placebo
`,

  example2SAS: `proc sql;
  create table TRT_COUNT as
  select TRT01A,
         count(distinct USUBJID) as N
  from ADSL
  group by TRT01A;
quit;`,

  example2R: `library(dplyr)

TRT_COUNT <- ADSL %>%
  group_by(TRT01A) %>%
  summarise(N = n_distinct(USUBJID))`,

  outputTable2: `
TRT01A     N
Drug A     2
Placebo    2
`,

  outputNote2:
    "GROUP BY creates counts per treatment group.",

   conclusion:
    "Key Takeaway:\n" +
    "• PROC SQL is commonly used for counts and summaries\n" +
    "• COUNT(DISTINCT) is heavily used in clinical programming\n" +
    "• INTO: stores values into macro variables\n" +
    "• n_distinct() in R matches COUNT(DISTINCT)\n" +
    "• pull() extracts the final scalar value from summarise()",
},
{
  id: "proc-means",
  category: "PROC Steps",
  title: "PROC MEANS",

  overview:
    "PROC MEANS is used to calculate descriptive statistics such as N, mean, standard deviation, median, quartiles, minimum, and maximum. In clinical programming, it is heavily used for summary tables and baseline characteristic tables. In R, the equivalent calculations are typically done using dplyr summarise().",

  behavior:
    "PROC MEANS automatically ignores missing values for numeric calculations. In R, na.rm = TRUE must usually be specified. Quartile calculations in R may not exactly match SAS unless the quantile type is adjusted. Using type = 5 in quantile() most closely matches PROC MEANS quartile calculations in many clinical programming scenarios.",

  sas: `proc means data=ADSL n mean std median q1 q3 min max maxdec=1;
  var AGE;
run;`,

  r: `library(dplyr)

ADSL %>%
  summarise(
    N      = sum(!is.na(AGE)),
    MEAN   = round(mean(AGE, na.rm = TRUE), 1),
    STD    = round(sd(AGE, na.rm = TRUE), 2),
    MEDIAN = round(median(AGE, na.rm = TRUE), 1),
    Q1     = round(quantile(AGE, 0.25, type = 5, na.rm = TRUE), 1),
    Q3     = round(quantile(AGE, 0.75, type = 5, na.rm = TRUE), 1),
    MIN    = round(min(AGE, na.rm = TRUE), 1),
    MAX    = round(max(AGE, na.rm = TRUE), 1)
  )`,

  details:
    "PROC MEANS is one of the most commonly used procedures in clinical programming for generating descriptive statistics. It is frequently used in demographic tables, baseline summaries, and safety outputs. In R, summarise() combined with statistical functions provides equivalent functionality. Quartile calculations require special attention because R and SAS use different default algorithms.",

  // ── Example 1 ─────────────────────────────
  example1Title: "Example 1 — Basic Descriptive Statistics",

  example1Desc:
    "Calculate N, Mean, Standard Deviation, Median, Quartiles, Minimum, and Maximum for AGE.",

  example1Input: `
USUBJID    AGE
CDISC001   45
CDISC002   52
CDISC003   38
CDISC004   61
CDISC005   29
CDISC006   47
CDISC007   55
CDISC008   41
`,

  exampleSAS: `proc means data=ADSL noprint;
  var AGE;

  output out=STAT
    n=
    mean=
    std=
    median=
    q1=
    q3=
    min=
    max=
    / autoname;
run;`,

  exampleR: `library(dplyr)

STAT <- ADSL %>%
  summarise(
    AGE_N      = sum(!is.na(AGE)),
    AGE_MEAN   = round(mean(AGE, na.rm = TRUE), 1),
    AGE_STD    = round(sd(AGE, na.rm = TRUE), 2),
    AGE_MEDIAN = round(median(AGE, na.rm = TRUE), 1),

    AGE_Q1 = round(
      quantile(
        AGE,
        probs = 0.25,
        type = 2,
        na.rm = TRUE
      ),
      1
    ),

    AGE_Q3 = round(
      quantile(
        AGE,
        probs = 0.75,
        type = 2,
        na.rm = TRUE
      ),
      1
    ),

    AGE_MIN = round(min(AGE, na.rm = TRUE), 1),
    AGE_MAX = round(max(AGE, na.rm = TRUE), 1)
  )`,

  outputTable1: `
AGE_N    AGE_MEAN    AGE_STD    AGE_MEDIAN    AGE_Q1    AGE_Q3    AGE_MIN    AGE_MAX
8        46.0        10.20      46.0          39.5      53.5      29.0       61.0
`,

  outputNote1:
    "PROC MEANS and R summarise() produce matching descriptive statistics when quantile(type = 5) is used for quartiles. R default quantile settings may produce slightly different Q1 and Q3 values compared to SAS.",

  // ── Example 2 ─────────────────────────────
  example2Title: "Example 2 — Treatment-wise Summary Statistics",

  example2Desc:
    "Calculate descriptive statistics by treatment group.",

  example2Input: `
USUBJID    TRT01A     AGE
CDISC001   Placebo    45
CDISC002   Placebo    52
CDISC003   Drug A     38
CDISC004   Drug A     61
CDISC005   Drug A     29
CDISC006   Placebo    47
CDISC007   Drug A     55
CDISC008   Placebo    41
`,

  example2SAS: `proc means data=ADSL noprint;
  class TRT01A;
  var AGE;

  output out=STAT_TRT
    n=
    mean=
    std=
    median=
    q1=
    q3=
    min=
    max=
    / autoname;
run;`,

  example2R: `library(dplyr)

library(dplyr)

STAT_TRT <- ADSL %>%
  group_by(TRT01A) %>%
  summarise(
    AGE_N      = sum(!is.na(AGE)),
    AGE_MEAN   = round(mean(AGE, na.rm = TRUE), 1),
    AGE_STD    = round(sd(AGE, na.rm = TRUE), 2),
    AGE_MEDIAN = round(median(AGE, na.rm = TRUE), 1),

    AGE_Q1 = round(
      quantile(
        AGE,
        probs = 0.25,
        type = 2,
        na.rm = TRUE
      ),
      1
    ),

    AGE_Q3 = round(
      quantile(
        AGE,
        probs = 0.75,
        type = 2,
        na.rm = TRUE
      ),
      1
    ),

    AGE_MIN = round(min(AGE, na.rm = TRUE), 1),
    AGE_MAX = round(max(AGE, na.rm = TRUE), 1)
  )`,

  outputTable2: `
TRT01A     AGE_N    AGE_MEAN    AGE_STD    AGE_MEDIAN    AGE_Q1    AGE_Q3    AGE_MIN    AGE_MAX
Drug A     4        45.8        14.59      46.5          33.5      58.0      29.0       61.0
Placebo    4        46.2        4.57       46.0          43.0      49.5      41.0       52.0

`,

  outputNote2:
    "CLASS statement in PROC MEANS corresponds to group_by() in R. Each treatment group receives its own descriptive statistics.",

 
  conclusion:
    "Key Takeaway:\n" +
    "• PROC MEANS calculates descriptive statistics\n" +
    "• summarise() in R provides equivalent functionality\n" +
    "• CLASS in SAS corresponds to group_by() in R\n" +
    "• na.rm = TRUE is important in R\n" +
    "• quantile(type = 5) helps match SAS quartiles\n" +
    "• round() helps align decimal display with SAS maxdec="
},
{
  id: "proc-freq",
  category: "PROC Steps",
  title: "PROC FREQ",

  overview:
    "PROC FREQ is used to calculate categorical counts, percentages, confidence intervals, and hypothesis test p-values. In clinical programming, it is commonly used for responder analyses, adverse event summaries, and binary endpoint analyses. In R, equivalent functionality is typically performed using binom.test() and prop.test().",

  behavior:
    "PROC FREQ can generate exact confidence intervals using the Clopper-Pearson method and perform one-sided or two-sided proportion tests. In R, binom.test() provides exact Clopper-Pearson confidence intervals similar to PROC FREQ EXACT BINOMIAL output.",

  sas: `proc freq data=ADSL;
  tables RESP / binomial(level='Y');

  exact binomial;

  ods output Binomial=STAT;
run;`,

  r: `library(dplyr)

RESP_Y <- ADSL %>%
  filter(RESP == "Y") %>%
  nrow()

TOTAL <- nrow(ADSL)

BT <- binom.test(
  x = RESP_Y,
  n = TOTAL,
  p = 0.5,
  alternative = "two.sided"
)

STAT <- tibble(
  RESP_Y = RESP_Y,
  TOTAL = TOTAL,
  PROP = round(BT$estimate * 100, 1),
  LCL = round(BT$conf.int[1] * 100, 1),
  UCL = round(BT$conf.int[2] * 100, 1),
  PVALUE = round(BT$p.value, 4)
)`,

  details:
    "PROC FREQ is heavily used in clinical trial reporting for categorical analyses. Exact Clopper-Pearson confidence intervals are commonly requested in regulatory outputs. In R, binom.test() provides exact binomial confidence intervals and p-values similar to SAS PROC FREQ EXACT BINOMIAL analyses.",

  // ── Example 1 ─────────────────────────────
  example1Title: "Example 1 — Clopper-Pearson 95% Confidence Interval",

  example1Desc:
    "Calculate responder proportion with exact 95% Clopper-Pearson confidence interval.",

  example1Input: `
USUBJID    RESP
CDISC001   Y
CDISC002   Y
CDISC003   N
CDISC004   Y
CDISC005   N
CDISC006   Y
CDISC007   Y
CDISC008   N
`,

  exampleSAS: `proc freq data=ADSL;
  tables RESP / binomial(level='Y');

  exact binomial;

  ods output Binomial=STAT(where=(strip(NAME1) in ("XL_BIN", "XU_BIN")));
run;`,

  exampleR: `library(dplyr)

RESP_Y <- ADSL %>%
  filter(RESP == "Y") %>%
  nrow()

TOTAL <- nrow(ADSL)

BT <- binom.test(
  x = RESP_Y,
  n = TOTAL,
  conf.level = 0.95
)

STAT <- tibble(
  RESP_Y = RESP_Y,
  TOTAL = TOTAL,
  PROP = round(BT$estimate * 100, 1),
  LCL = round(BT$conf.int[1] * 100, 1),
  UCL = round(BT$conf.int[2] * 100, 1)
)`,

  outputTable1: `
RESP_Y    TOTAL    PROP    LCL    UCL
5         8        62.5    24.5   91.5
`,

  outputNote1:
    "PROC FREQ EXACT BINOMIAL and R binom.test() both produce exact Clopper-Pearson confidence intervals.",

// ── Example 2 ─────────────────────────────
example2Title: "Example 2 — Clopper-Pearson 95% Confidence Interval by Sex",

example2Desc:
  "Calculate responder proportion with exact 95% Clopper-Pearson confidence interval separately for each SEX group.",

example2Input: `
USUBJID    SEX    RESP
CDISC001   M      Y
CDISC002   M      Y
CDISC003   M      N
CDISC004   M      Y
CDISC005   F      N
CDISC006   F      Y
CDISC007   F      Y
CDISC008   F      N
`,

example2SAS: `proc sort data=ADSL;
  by SEX;
run;

proc freq data=ADSL;
  by SEX;

  tables RESP / binomial(level='Y');

  exact binomial;

  ods output Binomial=STAT_SEX(where=(strip(NAME1) in ("XL_BIN", "XU_BIN")));
run;`,

example2R: `library(dplyr)

STAT_SEX <- ADSL %>%
  group_by(SEX) %>%
  summarise(
    RESP_Y = sum(RESP == "Y"),
    TOTAL = n(),
    .groups = "drop"
  ) %>%
  rowwise() %>%
  mutate(
    PROP = round(
      RESP_Y / TOTAL * 100,
      1
    ),

    LCL = round(
      binom.test(
        RESP_Y,
        TOTAL
      )$conf.int[1] * 100,
      1
    ),

    UCL = round(
      binom.test(
        RESP_Y,
        TOTAL
      )$conf.int[2] * 100,
      1
    )
  )`,

outputTable2: `
SEX    RESP_Y    TOTAL    PROP    LCL    UCL
F      2         4        50.0    6.8    93.2
M      3         4        75.0    19.4   99.4
`,

outputNote2:
  "PROC FREQ BY SEX calculates exact Clopper-Pearson confidence intervals separately within each subgroup. In R, group_by(SEX) achieves the same result.",

  // ── Example 3 ─────────────────────────────
  example3Title: "Example 3 — One-Sided and Two-Sided P-Value",

  example3Desc:
    "Perform exact binomial hypothesis test using one-sided and two-sided alternatives.",

  example3Input: `
USUBJID    RESP
CDISC001   Y
CDISC002   Y
CDISC003   N
CDISC004   Y
CDISC005   N
CDISC006   Y
CDISC007   Y
CDISC008   N
`,

  example3SAS: `proc freq data=ADSL;
  tables RESP / binomial(p=0.5 level='Y');

  exact binomial;

  ods output BinomialTest=STAT;
run;`,

  example3R: `library(dplyr)

RESP_Y <- ADSL %>%
  filter(RESP == "Y") %>%
  nrow()

TOTAL <- nrow(ADSL)

# Two-sided test
BT_TWO <- binom.test(
  x = RESP_Y,
  n = TOTAL,
  p = 0.5,
  alternative = "two.sided"
)

# One-sided test
BT_ONE <- binom.test(
  x = RESP_Y,
  n = TOTAL,
  p = 0.5,
  alternative = "greater"
)

STAT <- tibble(
  TEST = c("Two-Sided", "One-Sided"),
  PVALUE = c(
    round(BT_TWO$p.value, 4),
    round(BT_ONE$p.value, 4)
  )
)`,

  outputTable3: `
TEST          PVALUE
Two-Sided     0.7266
One-Sided     0.3633
`,

  outputNote3:
    "alternative='two.sided' performs two-sided hypothesis testing. alternative='greater' performs one-sided testing equivalent to testing whether response rate is greater than the null proportion.",

    // ── Example 4 ─────────────────────────────
example4Title: "Example 4 — Treatment A vs Placebo P-Value",

example4Desc:
  "Compare responder rates between treatment groups using Fisher's Exact Test.",

example4Input: `
USUBJID    TRT01A     RESP
CDISC001   Drug A     Y
CDISC002   Drug A     Y
CDISC003   Drug A     N
CDISC004   Drug A     Y
CDISC005   Placebo    N
CDISC006   Placebo    Y
CDISC007   Placebo    N
CDISC008   Placebo    N
`,

example4SAS: `proc freq data=ADSL;
  tables TRT01A*RESP / fisher;

  ods output FishersExact=STAT;
run;`,

example4R: `library(tibble)
library(dplyr)

ADSL <- tibble(
  USUBJID = c(
    "CDISC001",
    "CDISC002",
    "CDISC003",
    "CDISC004",
    "CDISC005",
    "CDISC006",
    "CDISC007",
    "CDISC008"
  ),
  TRT01A = c(
    "Drug A",
    "Drug A",
    "Drug A",
    "Drug A",
    "Placebo",
    "Placebo",
    "Placebo",
    "Placebo"
  ),
  RESP = c(
    "Y",
    "Y",
    "N",
    "Y",
    "N",
    "Y",
    "N",
    "N"
  )
)

TAB <- table(
  ADSL$TRT01A,
  ADSL$RESP
)

FT <- fisher.test(TAB)

STAT <- tibble(
  TEST = "Fisher Exact Test",
  PVALUE = round(
    FT$p.value,
    4
  )
)

STAT`,

outputTable4: `
TEST                PVALUE
Fisher Exact Test   0.4857
`,

outputNote4:
  "Fisher's Exact Test compares responder rates between Drug A and Placebo. PROC FREQ with the FISHER option corresponds to fisher.test() in R. This method is commonly used in clinical trial efficacy and safety analyses when sample sizes are small.",
 
  conclusion:
    "Key Takeaway:\n" +
    "• PROC FREQ is commonly used for categorical analyses\n" +
    "• EXACT BINOMIAL produces Clopper-Pearson confidence intervals\n" +
    "• binom.test() in R closely matches SAS exact analyses\n" +
    "• alternative='two.sided' gives two-sided p-values\n" +
    "• alternative='greater' or 'less' performs one-sided testing\n" +
    "• prop.test() is approximate while binom.test() is exact"
}
];

