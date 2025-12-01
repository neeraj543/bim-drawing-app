# BIM Drawing App - Development Plan

## Development Approach
**Step-by-Step Implementation with Review at Each Stage**

### Core Principles:
1. **One feature at a time** - Complete and commit each feature before moving to the next
2. **Method-by-method creation** - For controllers and components:
   - Create ONE method/function at a time
   - Show it to the user for review
   - Get approval before creating the next method
   - This ensures understanding and keeps code realistic
3. **Test before commit** - Always test functionality before committing
4. **Realistic commits** - One commit per complete feature

---

## Feature Implementation Order

### Feature 1: Projects - List & Create
- [ ] **Step 1:** ProjectController with DTOs ✅ DONE
  - Created: `ProjectCreateRequest.java`, `ProjectResponse.java`, `ProjectController.java`
  - Next: Review and approve before Step 2

- [ ] **Step 2:** DataInitializer (seed system user)
  - Create: `DataInitializer.java`
  - Commit: `feat: Add DataInitializer to seed system user`

- [ ] **Step 3:** Dashboard Component (list projects)
  - Create: `Dashboard.jsx`
  - Update: `App.jsx`
  - Commit: `feat: Add Dashboard page with project list`

- [ ] **Step 4:** Create Project Form
  - Add form to Dashboard
  - Commit: `feat: Add create project form to Dashboard`

- [ ] **Step 5:** Testing
  - Test backend endpoints
  - Test frontend integration
  - No commit (testing phase)

---

## Future Features (In Order)
- Feature 2: File Upload (DrawingFile management)
- Feature 3: Drawing Sets (revisions)
- Feature 4: Tasks (if needed)
- Feature 5: Authentication (if time permits)

