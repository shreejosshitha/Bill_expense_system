# Dashboard Fixes TODO

## Completed:
- [x] Analyze dashboard graphs and identify issues
- [x] Fix ManagerDashboard - Replace hardcoded delayData and deptData
- [x] Fix AccountsDashboard - Replace hardcoded monthlyData
- [x] Add charts to EmployeeDashboard (personal expense trend & category breakdown)

## Pending:
- [ ] Verify all fixes work correctly

---

## Fix Details:

### 1. ManagerDashboard ✅
- [x] Replace `delayData` with actual approval time data from approvalHistory
- [x] Replace `deptData` with vendor-wise expense from actual bills

### 2. AccountsDashboard ✅
- [x] Replace `monthlyData` with last 6 months of actual bill data

### 3. EmployeeDashboard (NEW!) ✅
- [x] Add personal expense trend chart (LineChart)
- [x] Add category-wise spending pie chart (PieChart)

---

## Note on AdminDashboard:
- Total Users: Would require a user management system (not in scope for this fix)
- Vendor charts: vendors array is empty by design - would need vendor management feature

