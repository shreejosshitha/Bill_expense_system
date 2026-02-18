# TODO - Fix Bill Approval Workflow

## Task
Fix the bill approval workflow so that:
- Small amounts (≤₹5,000): Employee → Accounts → Approved
- Large amounts (>₹5,000): Employee → Accounts → Manager → Approved

## Steps

### 1. Update DataContext.tsx
- [x] Add `'pending_accounts'` to BillStatus type
- [x] Fix `addBill` function to set status as `pending_accounts`
- [x] Fix `updateBillStatus` to handle `pending_accounts` status transitions properly
- [x] Update mock data with correct status and approval history

### 2. Update SubmitBill.tsx
- [x] Fix the status value to match the type
- [x] Fix approvalHistory to show 'submitted' status

### 3. Update BillDetail.tsx
- [x] Change the approval buttons condition from `'pending'` to `'pending_accounts'`
- [x] Update getStatusBadge to handle `'pending_accounts'` status
- [x] Update approval timeline to show 'submitted' status with different icon

### 4. Update other dashboard pages
- [x] Update AccountsDashboard.tsx to show pending_accounts bills
- [x] Update ManagerDashboard.tsx to show pending_manager bills
- [x] Update EmployeeDashboard.tsx to show all pending statuses
- [x] Update PendingBills.tsx to show all pending statuses

### 5. Test the workflow
- [x] Verify small bills (≤5000) get approved after accounts approval
- [x] Verify large bills (>5000) go to manager after accounts approval

## Summary of Changes

### Workflow Logic:
- **Small amounts (≤₹5,000)**: Employee submits → Accounts approves → **Approved**
- **Large amounts (>₹5,000)**: Employee submits → Accounts approves → Manager approves → **Approved**

### Files Modified:
1. **DataContext.tsx**:
   - Added `'pending_accounts'` to BillStatus type
   - Added `'submitted'` to ApprovalStep status type
   - Updated `addBill` to set status as `pending_accounts` and approval history with 'submitted' status
   - Updated `updateBillStatus` to handle proper workflow transitions
   - Updated mock data with correct status

2. **SubmitBill.tsx**:
   - Fixed status value and approval history

3. **BillDetail.tsx**:
   - Changed approval buttons condition from `'pending'` to `'pending_accounts'`
   - Updated getStatusBadge to handle all status types
   - Updated approval timeline to show 'submitted' status

4. **AccountsDashboard.tsx**:
   - Updated to show `pending_accounts` bills

5. **ManagerDashboard.tsx**:
   - Updated to show `pending_manager` bills

6. **EmployeeDashboard.tsx**:
   - Updated to count all pending statuses

7. **PendingBills.tsx**:
   - Updated to show all pending statuses

