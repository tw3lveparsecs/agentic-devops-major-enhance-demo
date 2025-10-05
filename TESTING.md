# Credits System Testing Guide

## Issue Fixed

The Imperial Treasury credits were not updating in the header after purchases due to a race condition in the `deductCredits` function.

## Fix Applied

- Modified `CreditsContext.tsx` `deductCredits` function to check credits synchronously before calling `setCredits`
- Eliminated race condition between state update and function return value
- Ensures UI updates immediately after successful purchase

## Manual Testing Steps

### Test 1: Successful Purchase

1. Open the Imperial Supply Hub
2. Log in with any credentials
3. Note the starting credits displayed in header (should be "100 trillion credits")
4. Add any vehicle to cart (e.g., TIE Fighter - 25 million credits)
5. Go to cart and proceed to checkout
6. Fill out requisition form and submit
7. **Expected Result**: Credits in header should immediately update to show reduced amount (99.98 trillion credits)

### Test 2: Multiple Purchases

1. Complete Test 1 first
2. Add another vehicle worth around 50 billion credits
3. Complete checkout process
4. **Expected Result**: Credits should continue to decrease correctly and display updated amounts

### Test 3: Insufficient Credits Handling

1. Find the most expensive vehicle in the catalog
2. Keep purchasing until credits are low
3. Try to purchase something that costs more than remaining credits
4. **Expected Result**:
   - Error message should appear
   - Credits should NOT be deducted
   - Header should show unchanged credit amount

### Test 4: Reset Functionality (Clearance Level 9+ Only)

1. Login with `tarkin` or `vader` (clearance level 10)
2. Complete several purchases to reduce credits
3. Click the reset button (circular arrow icon) in header
4. **Expected Result**: Credits should reset to original levels and header should update immediately

## Key Indicators of Success

- ✅ Header credits update immediately after purchase (no delay or refresh needed)
- ✅ Credits decrease by exact purchase amount
- ✅ Success toast appears with deducted amount
- ✅ Inventory updates correctly alongside credit deduction
- ✅ System prevents purchases when insufficient credits

## Technical Verification

The fix ensures that:

- `deductCredits()` returns correct boolean synchronously
- `useKV` state updates trigger React re-renders properly
- No race conditions between state updates and UI rendering
- Toast notifications appear at the correct time
