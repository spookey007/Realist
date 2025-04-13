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

export const userJoin = async (rows, fieldRef = "created_by") => {
    if (!rows || !rows.length) return rows;

    // Get all user IDs from the rows
    const userIds = rows.map(row => row[fieldRef]).filter(Boolean);
    if (!userIds.length) return rows;

    // Get the pool from the db module
    const { pool } = await import('../db/db.js');

    // Fetch all users in a single query
    const usersResult = await pool.query(
        `SELECT * FROM "Users" WHERE id = ANY($1)`,
        [userIds]
    );

    // Create a map of users by ID
    const usersMap = usersResult.rows.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
    }, {});

    // Process each row and add the user data
    return rows.map(row => {
        const userId = row[fieldRef];
        if (!userId) return row;

        const user = usersMap[userId];
        if (!user) return row;

        return {
            ...row,
            [fieldRef]: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                address: user.address,
                city: user.city,
                state: user.state,
                country: user.country,
                postal_code: user.postal_code,
                company_name: user.company_name,
                website: user.website,
                service_category: user.service_category,
                years_of_experience: user.years_of_experience,
                issuingAuthority: user.issuingAuthority,
                coverage_area: user.coverage_area,
                specialties: user.specialties,
                affiliations: user.affiliations
            }
        };
    });
};
  