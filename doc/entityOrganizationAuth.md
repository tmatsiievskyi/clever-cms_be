1. `Organization`. Represents a different types of companies. Each `organization` can have multiple `units`. Creating `organization` should create `unit`. Should have at least one `unit`. Start point. Each `organization` can have its own set of users, roles, policies and units.

**Fields**

- `id`: identifier
- `name` Name of organization. _UNIQUE_
- `email` Email of organization
- `unit` many-to-one
- `...`

2. `Unit`. Represents specific division of `Organization`. Medical `organization` - Dentist, Cardiology, etc. Helps organize structure of `organization`, allowing better management of departments and their specific roles and policies. Represet tree architecture.

**Fields**

- `id`: identifier
- `name` Name of unit.

- `parentUnitId` one-to-many
- `childUnitId` many-to-one

- `organizationId` one-to-many
- `user` many-to-many
- `role` many-to-many
- `...`

3. `User`. Represents individuals who can access CRM. Medical `organization` - Doctor, Nurses, etc. Primary actors in the system

**Fields**

- `id`: identifier
- `email` Email. _UNIQUE_
- `password`
- `firstName`
- `lastName`
- `isActive`
- `isVerified`

- `unit` many-to-many
- `roles` many-to-many
- `policies` many-to-many
- `...`

4. `Policy`. Represents a set of permissions that dictate what actions can perform on resources. `Policy` can be linked to user, role or unit. It is implementation of access control. Allow `organization` to define who can do what within the system.

**Fields**

- `id`: identifier
- `name` Name of Policy.
- `effect` String. Indicates if policy _Allow_ or _Deny_ access
- `actions` String[]. Array of actions that the policy allows or deniest. ["User:ListUser"]
- `resources` String[]. Array of resources that actions apply to. ["*"]
- `conditions` Json?. Optional JSON field for additional conditions that must be met for the policy to apply.
- `unit` many-to-many
- `roles` many-to-many
- `policies` many-to-many
- `...`

5. `Role`. Represents a set of policies that can be asssigned to unit or user

**Fields**

- `id`: identifier
- `name` Name of Policy.
- `description` String
- `policies` many-to-many
- `users` many-to-many
- `units` many-to-many
