package com.daod.iov.modules.role.event;

import com.daod.iov.modules.role.entity.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * 角色删除事件
 */
@Data
@AllArgsConstructor
@ToString
public class RoleDeletedEvent {
    private Role role;
    private LocalDateTime timestamp = LocalDateTime.now();
}
