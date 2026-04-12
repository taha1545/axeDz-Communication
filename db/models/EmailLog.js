module.exports = (sequelize, DataTypes) => {
  const EmailLog = sequelize.define('EmailLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
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
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('queued', 'sent', 'failed'),
      defaultValue: 'queued',
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
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
  }, {
    tableName: 'email_logs',
    timestamps: false,
  });

  return EmailLog;
};