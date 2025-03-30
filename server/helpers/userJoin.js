// db/helpers/userJoin.js

const allUserFields = {
    id: `u.id AS user_id`,
    name: `u.name`,
    email: `u.email`,
    status: `u.status`,
    role: `u.role`,
    phone: `u.phone`,
    address: `u.address`,
    city: `u.city`,
    state: `u.state`,
    country: `u.country`,
    postal_code: `u.postal_code`,
    lat: `u.lat`,
    lon: `u.lon`,
    last_login: `u.last_login`,
    profile_picture_url: `u.profile_picture_url`,
    createdAt: `u."createdAt"`,
    updatedAt: `u."updatedAt"`,
    company_name: `u.company_name`,
    website: `u.website`,
    service_category: `u.service_category`,
    years_of_experience: `u.years_of_experience`,
    coverage_area: `u.coverage_area`,
    license_number: `u.license_number`,
    insurance_policy: `u.insurance_policy`,
    references: `u.references`,
    description: `u.description AS user_description`,
    files: `u.files`,
    licenseNumber: `u."licenseNumber"`,
    issuingAuthority: `u."issuingAuthority"`,
    specialties: `u.specialties`,
    affiliations: `u.affiliations`,
  };
  
  export const userJoin = (
    fieldRef = "s.created_by",
    selectedFields = null // null means "use all"
  ) => {
    const joinClause = `LEFT JOIN "Users" u ON ${fieldRef} = u.id`;
  
    const userFields = selectedFields
      ? selectedFields.map((key) => allUserFields[key]).filter(Boolean)
      : Object.values(allUserFields); // default: include all
  
    return {
      joinClause,
      userFields,
    };
  };
  