module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add file_path column to notices table
    await queryInterface.addColumn('notices', 'file_path', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'created_by'
    });

    // Add file_path column to assignments table
    await queryInterface.addColumn('assignments', 'file_path', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'created_by'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove file_path column from notices table
    await queryInterface.removeColumn('notices', 'file_path');

    // Remove file_path column from assignments table
    await queryInterface.removeColumn('assignments', 'file_path');
  }
};
