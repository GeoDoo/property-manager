package com.vault;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.refresh.ContextRefresher;
import org.springframework.stereotype.Component;
import org.springframework.vault.core.lease.SecretLeaseContainer;
import org.springframework.vault.core.lease.event.SecretLeaseExpiredEvent;

@Component
class Vault {
    private final Log log = LogFactory.getLog(getClass());

    Vault(@Value("${spring.cloud.vault.database.role}") String databaseRole,
                   @Value("${spring.cloud.vault.database.backend}") String databaseBackend,
                   SecretLeaseContainer leaseContainer,
                   ContextRefresher contextRefresher) {

        var vaultCredsPath = String.format("%s/creds/%s", databaseBackend, databaseRole);

        leaseContainer.addLeaseListener(event -> {
            if (vaultCredsPath.equals(event.getSource().getPath())) {
                if (event instanceof SecretLeaseExpiredEvent) {
                    try {
                        contextRefresher.refresh();
                        log.info("Database credentials refreshed successfully");
                    } catch (Exception e) {
                        log.error("Failed to refresh database credentials", e);
                    }
                }
            }
        });
    }
}