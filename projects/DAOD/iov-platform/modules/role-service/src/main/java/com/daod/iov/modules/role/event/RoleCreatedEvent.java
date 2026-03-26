package com.daod.iov.modules.role.event;

import com.daod.iov.modules.role.entity.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * 角色创建事件
 */
@Data
@AllArgsConstructor
@ToString
public class RoleCreatedEvent {
    private Role role;
    private LocalDateTime timestamp = LocalDateTime.now();
}
