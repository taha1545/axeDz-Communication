module.exports = (sequelize, DataTypes) => {
  const EmailLog = sequelize.define(
    'EmailLog',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      api_key_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      to_email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      body_type: {
        type: DataTypes.ENUM('text', 'html'),
        allowNull: false,
        defaultValue: 'text',
      },
      status: {
        type: DataTypes.ENUM('queued', 'sent', 'failed'),
        defaultValue: 'queued',
      },
      retry_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      sent_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'email_logs',
      timestamps: false,
    },
  );

  return EmailLog;
};
