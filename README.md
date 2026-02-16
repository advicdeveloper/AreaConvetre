# Area Converter PCF Control

This is a **PowerApps Component Framework (PCF)** control developed for Dynamics 365 / Dataverse. It allows users to input area values in various units (e.g., Square Feet, Acres, Hectares) and automatically converts and stores them as **Square Meters** in the underlying Dataverse field.

## Features

- **Multi-unit Support**: Supports conversion between:
  - Square Meter ($m^2$) - *Base Unit*
  - Square Kilometer ($km^2$)
  - Square Foot ($ft^2$)
  - Square Yard ($yd^2$)
  - Square Mile ($mi^2$)
  - Acre ($ac$)
  - Hectare ($ha$)
- **Real-time Conversion**: Automatically converts input values to Square Meters for storage.
- **Fluent UI Integration**: Built using Fluent UI React controls for a native Dynamics 365 look and feel.
- **Precision Handling**: Handles decimal precision up to 4 decimal places for accurate storage.

## Requirements

- **Node.js**: LTS version recommended.
- **Microsoft Power Platform CLI**: For building and deploying the control.
- **Visual Studio Code**: Recommended editor.

## Installation & Setup

1. **Clone the repository** (if applicable) or navigate to the project folder.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Build the control**:
   ```bash
   npm run build
   ```

## Development

### Running Locally (Test Harness)
To inspect and debug the control in the local PCF test harness:

```bash
npm start
```
This will open a local browser window where you can test the control's inputs and outputs without deploying to Dataverse.

### Deploying to Dataverse

1. **Authenticate**:
   ```bash
   pac auth create --url https://<your-org>.crm.dynamics.com
   ```

2. **Push to Environment** (Quick Deployment for Dev):
   ```bash
   pac pcf push --publisher-prefix <your-prefix>
   ```
   *Note: This creates a temporary solution in your environment.*

3. **Create Solution Package** (Production/ALM):
   ```bash
   mkdir Solutions
   pac solution init --publisher-name <name> --publisher-prefix <prefix>
   pac solution add-reference --path ..
   dotnet build
   ```

## Usage

1. Open your **Power Apps** environment (make.powerapps.com).
2. Go to your **Table** and find the **Number** field (Decimal or Whole Number) you want to apply this control to.
3. Switch to **Classic** solution explorer or use the modern **Form Editor**.
4. Add the **AreaConverterPCF** component to the field.
5. Bind the `Area Value` property to your field.
6. Save and Publish the form.

Now, when users enter a value in any unit (e.g., Acres), the system will display that unit but save the equivalent Square Meters value in the database.

## Project Structure

- `AreaConverterPCF/` - Source code for the control.
  - `index.ts` - Entry point for the PCF control.
  - `AreaConverter.tsx` - React component for the UI.
  - `conversion.ts` - Logic for unit conversions.
  - `ControlManifest.Input.xml` - Defines properties and resources.
