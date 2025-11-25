# Descriptive Statistics Component Location Guide

## Overview

The **Descriptive Statistics** component is a comprehensive interactive analysis tool that displays detailed statistical metrics for research variables.

## Current Location

The Descriptive Statistics component is implemented in:

### Component File
- **File:** `app/components/InteractiveAnalysis.tsx`
- **Mode:** `mode="table"`
- **Function:** `InteractiveAnalysis({ mode: "table" })`

### Where It's Used

1. **Workflow Page** (`app/workflow/page.tsx`)
   - Located at line 54
   - Displayed in the "API" card section
   - Shows descriptive statistics for workflow variables

2. **Homepage** (Previously removed)
   - Previously displayed in the features section
   - Can be re-added if needed

## Features

The Descriptive Statistics component includes:

### Table Columns

- **Variable** - Variable name/identifier
- **Mean** - Average value
- **SD** - Standard deviation
- **Median** - Median value
- **Min** - Minimum value
- **Max** - Maximum value
- **Skewness** - Distribution skewness (color-coded)
- **Kurtosis** - Distribution kurtosis (color-coded)
- **α (Cronbach)** - Cronbach's Alpha reliability coefficient
- **CR** - Composite Reliability
- **AVE** - Average Variance Extracted

### Interactive Features

When you **click on a variable row**, detailed analysis appears including:

1. **Reliability & Validity**
   - Cronbach's Alpha with quality indicator (Excellent/Good/Acceptable)
   - Composite Reliability (CR)
   - Average Variance Extracted (AVE)

2. **Distribution & Normality**
   - Normality test results (Shapiro-Wilk)
   - Normality p-value
   - Skewness analysis
   - Kurtosis analysis

3. **Significant Correlations**
   - Correlation coefficients with other variables
   - Statistical significance indicators (***, **, *)

4. **Descriptive Statistics**
   - Range (Min-Max)
   - Interquartile Range (IQR)
   - Mean vs Median comparison

### Color Coding

- **Green** - Excellent/Normal distribution
- **Blue** - Good/Moderate
- **Yellow** - Fair/Acceptable
- **Red** - Needs attention/Severe issues

## Data Source

The component uses mock data defined in `app/components/InteractiveAnalysis.tsx`:

```typescript
const tableData: ExtendedTableData[] = [
  {
    variable: "PU", // Perceived Usefulness
    mean: 4.23,
    sd: 0.89,
    // ... other metrics
  },
  // ... more variables
];
```

Currently includes 6 variables:
- PU (Perceived Usefulness)
- PEOU (Perceived Ease of Use)
- BI (Behavioral Intention)
- TR (Trust)
- SAT (Satisfaction)
- PE (Perceived Error/Risk)

## How to Add to a Page

To add Descriptive Statistics to any page:

```tsx
import { InteractiveAnalysis } from "../components/InteractiveAnalysis";

// In your component:
<InteractiveAnalysis mode="table" initialView="overview" />
```

## Styling

Styles are defined in `app/globals.css`:

- `.interactive-analysis-table` - Main container
- `.variable-detail` - Detailed analysis panel
- `.detail-grid` - Grid layout for details
- `.detail-section` - Section container
- `.detail-item` - Individual detail item

## Future Enhancements

Potential improvements:
- Connect to real data API
- Export functionality (CSV, PDF)
- Filtering and sorting
- Custom variable selection
- Comparison mode between variables

## Related Components

- `InteractiveAnalysis` (mode="chart") - Workflow progress charts
- `ProjectDashboard` - Research scenarios dashboard
- `AdvancedSEMVisualization` - SEM model visualization

