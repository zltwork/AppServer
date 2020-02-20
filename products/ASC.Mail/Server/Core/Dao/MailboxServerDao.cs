/*
 *
 * (c) Copyright Ascensio System Limited 2010-2018
 *
 * This program is freeware. You can redistribute it and/or modify it under the terms of the GNU 
 * General Public License (GPL) version 3 as published by the Free Software Foundation (https://www.gnu.org/copyleft/gpl.html). 
 * In accordance with Section 7(a) of the GNU GPL its Section 15 shall be amended to the effect that 
 * Ascensio System SIA expressly excludes the warranty of non-infringement of any third-party rights.
 *
 * THIS PROGRAM IS DISTRIBUTED WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR
 * FITNESS FOR A PARTICULAR PURPOSE. For more details, see GNU GPL at https://www.gnu.org/copyleft/gpl.html
 *
 * You can contact Ascensio System SIA by email at sales@onlyoffice.com
 *
 * The interactive user interfaces in modified source and object code versions of ONLYOFFICE must display 
 * Appropriate Legal Notices, as required under Section 5 of the GNU GPL version 3.
 *
 * Pursuant to Section 7 § 3(b) of the GNU GPL you must retain the original ONLYOFFICE logo which contains 
 * relevant author attributions when distributing the software. If the display of the logo in its graphic 
 * form is not reasonably feasible for technical reasons, you must include the words "Powered by ONLYOFFICE" 
 * in every copy of the program you distribute. 
 * Pursuant to Section 7 § 3(e) we decline to grant you any rights under trademark law for use of our trademarks.
 *
*/


//using System;
//using System.Collections.Generic;
//using System.Linq;
//using ASC.Common.Data;
//using ASC.Common.Data.Sql;
//using ASC.Mail.Core.Dao.Interfaces;
//using ASC.Mail.Core.DbSchema;
//using ASC.Mail.Core.DbSchema.Interfaces;
//using ASC.Mail.Core.DbSchema.Tables;
//using ASC.Mail.Core.Entities;

using ASC.Api.Core;
using ASC.Core;
using ASC.Core.Common.EF;
using ASC.Mail.Core.Dao.Entities;
using System.Collections.Generic;
using ASC.Mail.Core.Dao.Interfaces;
using ASC.Mail.Core.Entities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace ASC.Mail.Core.Dao
{
    public class MailboxServerDao : BaseDao, IMailboxServerDao
    {
        public MailboxServerDao(ApiContext apiContext,
            SecurityContext securityContext,
            DbContextManager<MailDbContext> dbContext) 
            : base(apiContext, securityContext, dbContext)
        {
        }

        public MailboxServer GetServer(int id)
        {
            /*var query = Query()
                .Where(MailboxServerTable.Columns.Id, id);

            return Db.ExecuteList(query)
                .ConvertAll(ToMailboxServer)
               .SingleOrDefault();*/

            return null;
        }

        public List<MailboxServer> GetServers(int providerId, bool isUserData = false)
        {
            //var query = Query()
            //    .Where(MailboxServerTable.Columns.ProviderId, providerId)
            //    .Where(MailboxServerTable.Columns.IsUserData, isUserData);

            //return Db.ExecuteList(query)
            //    .ConvertAll(ToMailboxServer);

            return null;
        }

        public int SaveServer(MailboxServer mailboxServer)
        {
            //var query = new SqlInsert(MailboxServerTable.TABLE_NAME, true)
            //    .InColumnValue(MailboxServerTable.Columns.Id, mailboxServer.Id)
            //    .InColumnValue(MailboxServerTable.Columns.ProviderId, mailboxServer.ProviderId)
            //    .InColumnValue(MailboxServerTable.Columns.Type, mailboxServer.Type)
            //    .InColumnValue(MailboxServerTable.Columns.Hostname,  mailboxServer.Hostname)
            //    .InColumnValue(MailboxServerTable.Columns.Port,  mailboxServer.Port)
            //    .InColumnValue(MailboxServerTable.Columns.SocketType,  mailboxServer.SocketType)
            //    .InColumnValue(MailboxServerTable.Columns.Username,  mailboxServer.Username)
            //    .InColumnValue(MailboxServerTable.Columns.Authentication, mailboxServer.Authentication)
            //    .InColumnValue(MailboxServerTable.Columns.IsUserData, mailboxServer.IsUserData)
            //    .Identity(0, 0, true);

            //var id = Db.ExecuteScalar<int>(query);

            //return id;

            return -1;
        }

        public int DelteServer(int id)
        {
            //var query = new SqlDelete(MailboxServerTable.TABLE_NAME)
            //    .Where(MailboxServerTable.Columns.Id, id);

            //return Db.ExecuteNonQuery(query);

            return -1;
        }

        protected MailboxServer ToMailboxServer(MailMailboxServer r)
        {
            var s = new MailboxServer
            {
                Id = r.Id,
                ProviderId = r.IdProvider,
                Type = r.Type,
                Hostname = r.Hostname,
                Port = r.Port,
                SocketType = r.SocketType,
                Username = r.Username,
                Authentication = r.Authentication,
                IsUserData = r.IsUserData
            };

            return s;
        }
    }

    public static class MailboxServerDaoExtension
    {
        public static IServiceCollection AddMailboxServerDaoService(this IServiceCollection services)
        {
            services.TryAddScoped<MailboxServer>();

            return services;
        }
    }
}